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
import Loader from "./main/Loader";
import ErrorMessage from "./main/ErrorMessage";
import SelectedMovie from "./main/SelectedMovie";

function App() {
  const [movies, setMovies] = useState([]);
  const [watched, setWatched] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const [query, setQuery] = useState("");
  const [selectedId, setSelectedId] = useState(null);

  function handleSelectedId(id) {
    setSelectedId((selectedId) => (selectedId === id ? null : id));
  }
  function handleCloseId() {
    setSelectedId(null);
  }

  function handleAddWatched(movie) {
    setWatched((watched) => [...watched, movie]);
  }

  function handleDeleteWatched(id) {
    setWatched((watched) => watched.filter((movie) => movie.imdbID !== id));
  }

  useEffect(
    function () {
      async function fetchApi() {
        try {
          setIsLoading(true);
          setError("");
          const res = await fetch(
            `http://www.omdbapi.com/?i=tt3896198&apikey=f1670ed0&s=${query}`
          );
          if (!res.ok)
            throw new Error(
              "something went wrong with fetching the data... :("
            );
          const data = await res.json();
          if (data.Response === "False") {
            throw new Error("movie not found");
          }
          setMovies(data.Search);
        } catch (err) {
          console.error(err.message);
          setError(err.message);
        } finally {
          setIsLoading(false);
        }
      }
      if (query.length < 4) {
        setMovies([]);
        setError("");
        return;
      }
      fetchApi();
    },
    [query]
  );

  return (
    <>
      <NavBar>
        <Search query={query} setQuery={setQuery} />
        <NumResults movies={movies} />
      </NavBar>
      <MainComp>
        <Box>
          {isLoading && <Loader />}
          {!isLoading && !error && (
            <MoviesList movies={movies} onSelectId={handleSelectedId} />
          )}
          {error && <ErrorMessage message={error} />}
        </Box>
        <Box>
          {selectedId ? (
            <SelectedMovie
              selectedId={selectedId}
              onCloseId={handleCloseId}
              onAddWatched={handleAddWatched}
              watched={watched}
            />
          ) : (
            <>
              <WatchedSummary watched={watched} />
              <WatchedMoviesList
                watched={watched}
                onDeleteWatched={handleDeleteWatched}
              />
            </>
          )}
        </Box>
      </MainComp>
    </>
  );
}

export default App;
