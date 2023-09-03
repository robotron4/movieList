import { useEffect, useState } from "react";
import Rating from "../Rating";
import Loader from "./Loader";
/* eslint-disable react/prop-types */

export default function SelectedMovie({
  selectedId,
  onCloseId,
  onAddWatched,
  watched,
}) {
  const [movie, setMovie] = useState({});
  const [isLoading, setIsLoading] = useState(false);
  const [userRating, setUserRating] = useState("");

  const isWatched = watched.map((movie) => movie.imdbID).includes(selectedId);
  const watchedUserRating = watched.find(
    (movie) => movie.imdbID === selectedId
  )?.userRating;
  const {
    Title,
    Year,
    Poster,
    Runtime,
    imdbRating,
    Plot,
    Released,
    Actors,
    Director,
  } = movie;

  function handleAdd() {
    const newWatchedMovie = {
      imdbID: selectedId,
      Title,
      Year,
      Poster,
      imdbRating: Number(imdbRating),
      Runtime: Number(Runtime.split(" ").at(0)),
      userRating,
    };
    onAddWatched(newWatchedMovie);
    onCloseId();
  }

  useEffect(
    function () {
      async function getMovieDetails() {
        setIsLoading(true);
        const res = await fetch(
          `http://www.omdbapi.com/?i=${selectedId}&apikey=f1670ed0`
        );
        const data = await res.json();
        setMovie(data);
        setIsLoading(false);
      }
      getMovieDetails();
    },
    [selectedId]
  );

  useEffect(
    function () {
      if (!Title) {
        return;
      }
      document.title = `Movie | ${Title}`;
      //CLEANUP FUNCTION:
      return function () {
        document.title = "movieList";
      };
    },
    [Title]
  );

  return isLoading ? (
    <Loader />
  ) : (
    <>
      <div className="details">
        <header>
          <button onClick={onCloseId} className="btn-back">
            &larr;
          </button>
          <img src={Poster} alt="" />
          <div className="details-overview">
            <h2>{Title}</h2>
            <p>
              {Released} &bull; {Runtime}
            </p>
            <p>{Rating}</p>
            <p>
              <span>🌟</span>
              {imdbRating} imbd Rating
            </p>
          </div>
        </header>

        <section>
          <div className="rating">
            {!isWatched ? (
              <>
                <Rating maxRating={10} size={27} onSetRating={setUserRating} />
                {userRating > 0 && (
                  <button className="btn-add" onClick={handleAdd}>
                    + add Movie to list
                  </button>
                )}
              </>
            ) : (
              <p>you already rated this movie with {watchedUserRating} Stars</p>
            )}
          </div>
          <p>
            <em>{Plot}</em>
          </p>
          <p>Starring {Actors}</p>
          <p>Directed by {Director}</p>
        </section>
      </div>
    </>
  );
}
