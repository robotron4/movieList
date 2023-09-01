/* eslint-disable react-hooks/exhaustive-deps */
import { useEffect, useState } from "react";
import NavBar from "./nav/NavBar";
import MainComp from "./main/MainComp";
import NumResults from "./nav/NumResults";
import Search from "./nav/Search";
import Box from "./main/Box";
import MoviesList from "./main/MoviesList";
import WatchedSummary from "./main/WatchedSummary";
import WatchedMoviesList from "./main/WatchedMoviesList";
import Rating from "./Rating";
import Loader from "./main/Loader";
import ErrorMessage from "./main/ErrorMessage";

const tempWatchedData = [
  {
    imdbID: "tt1375666",
    Title: "Inception",
    Year: "2010",
    Poster:
      "https://m.media-amazon.com/images/M/MV5BMjAxMzY3NjcxNF5BMl5BanBnXkFtZTcwNTI5OTM0Mw@@._V1_SX300.jpg",
    runtime: 148,
    imdbRating: 8.8,
    userRating: 10,
  },
  {
    imdbID: "tt0088763",
    Title: "Back to the Future",
    Year: "1985",
    Poster:
      "https://m.media-amazon.com/images/M/MV5BZmU0M2Y1OGUtZjIxNi00ZjBkLTg1MjgtOWIyNThiZWIwYjRiXkEyXkFqcGdeQXVyMTQxNzMzNDI@._V1_SX300.jpg",
    runtime: 116,
    imdbRating: 8.5,
    userRating: 9,
  },
];

function App() {
  const [movies, setMovies] = useState([]);
  const [watched, setWatched] = useState(tempWatchedData);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const query = "grinch";
  useEffect(function () {
    async function fetchApi() {
      try {
        setIsLoading(true);
        const res = await fetch(
          `http://www.omdbapi.com/?i=tt3896198&apikey=f1670ed0&s=${query}`
        );
        if (!res.ok)
          throw new Error("something went wrong with fetching the data... :(");
        const data = await res.json();
        if (data.Response === "False") {
          throw new Error("movie not found");
        }
        setMovies(data.Search);
      } catch (err) {
        console.error(err.message);
        setError(err.message);
        console.log(error);
      } finally {
        setIsLoading(false);
      }
    }
    fetchApi();
  }, []);

  return (
    <>
      <NavBar>
        <Search />
        <NumResults movies={movies} />
      </NavBar>
      <MainComp>
        <Box>
          {isLoading && <Loader />}
          {!isLoading && !error && <MoviesList movies={movies}></MoviesList>}
          {error && <ErrorMessage message={error} />}
        </Box>
        <Box>
          <WatchedSummary watched={watched} />
          <WatchedMoviesList watched={watched} />
        </Box>
      </MainComp>
      <Rating maxRating={10}></Rating>
    </>
  );
}

export default App;
