import { useEffect, useState } from "react";
import { useKey } from "../useKey";
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
    Title: title,
    Year: year,
    Poster: poster,
    Runtime: runtime,
    imdbRating,
    Plot: plot,
    Released: released,
    Actors: actors,
    Director: director,
  } = movie;

  function handleAdd() {
    const newWatchedMovie = {
      imdbID: selectedId,
      title,
      year,
      poster,
      imdbRating: Number(imdbRating),
      Runtime: Number(runtime.split(" ").at(0)),
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

  useKey("Escape", onCloseId);

  useEffect(
    function () {
      if (!title) {
        return;
      }
      document.title = `Movie | ${title}`;
      //CLEANUP FUNCTION:
      return function () {
        document.title = "movieList";
      };
    },
    [title]
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
          <img src={poster} alt="" />
          <div className="details-overview">
            <h2>{title}</h2>
            <p>
              {released} &bull; {runtime}
            </p>
            <p>{userRating}</p>
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
            <em>{plot}</em>
          </p>
          <p>Starring {actors}</p>
          <p>Directed by {director}</p>
        </section>
      </div>
    </>
  );
}
