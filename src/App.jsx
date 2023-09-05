/* eslint-disable react-hooks/exhaustive-deps */
import { useState } from "react";
import { useFetch } from "./useFetch";
import { useLocalStorageState } from "./useLocalStorageState";
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
  const [query, setQuery] = useState("");
  const [selectedId, setSelectedId] = useState(null);
  const [watched, setWatched] = useLocalStorageState([]);

  const { movies, isLoading, error } = useFetch(query, handleCloseId);

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
