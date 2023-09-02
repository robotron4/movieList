import { useEffect, useState } from "react";
import Rating from "../Rating";
import Loader from "./Loader";
/* eslint-disable react/prop-types */

export default function SelectedMovie({ selectedId, onCloseId }) {
  const [movie, setMovie] = useState({});
  const [isLoading, setIsLoading] = useState(false);
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
  return isLoading ? (
    <Loader />
  ) : (
    <>
      <div className="details">
        <header>
          <button onClick={onCloseId} className="btn-back">
            &larr;
          </button>
          <img src={movie.Poster} alt="" />
          <div className="details-overview">
            <h2>{movie.Title}</h2>
            <p>
              {movie.Released} &bull; {movie.Runtime}
            </p>
            <p>{movie.Rating}</p>
            <p>
              <span>🌟</span>
              {movie.imdbRating} imbd Rating
            </p>
          </div>
        </header>

        <section>
          <Rating maxRating={10} size={27} />
          <p>
            <em>{movie.Plot}</em>
          </p>
          <p>Starring {movie.Actors}</p>
          <p>Directed by {movie.Director}</p>
        </section>
      </div>
    </>
  );
}
