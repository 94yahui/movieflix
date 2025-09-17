import React, { useEffect, useState } from "react";

import Search from "./components/Search.jsx";
import Spinner from "./components/Spinner.jsx";
import MovieCard from "./components/MovieCard.jsx";
import { useDebounce } from "react-use";
import { getTrendingMoives, updateSearchCount } from "./appwrite.js";

const API_BASE_URL = "https://api.themoviedb.org/3";

const API_KEY = import.meta.env.VITE_TMDB_API_KEY;

const API_OPTIONS = {
  method: "GET",
  headers: {
    accept: "application/json",
    AUthorization: `Bearer ${API_KEY}`,
  },
};

const App = () => {
  const [searchItem, setSearchItem] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
  const [movieList, setMovieList] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [debouncedSearchTerm, setDebouncedSearchTerm] = useState("");
  const [trendingMovies, setTrendingMovies] = useState([]);

  useDebounce(() => setDebouncedSearchTerm(searchItem), 500, [searchItem]);

  const fecthMovies = async (query = "") => {
    setIsLoading(true);
    setErrorMessage("");
    try {
      const endpoint = query
        ? `${API_BASE_URL}/search/movie?query=${encodeURIComponent(query)}`
        : `${API_BASE_URL}/discover/movie?sort_by=popularity.desc`;
      const response = await fetch(endpoint, API_OPTIONS);

      if (!response.ok) {
        throw new Error("Failed to fetch movies");
      }

      const data = await response.json();
      if (data.Response === "False") {
        setErrorMessage(data.Error || "Failed to fetch movies");
        setMovieList([]);
        return;
      }

      setMovieList(data.results || []);

      if (query && data.results.length > 0) {
        await updateSearchCount(query, data.results[0]);
      }
    } catch (error) {
      console.log("Error fetching movies: ", error);
      setErrorMessage("Error fetching movies, please try again later.");
    } finally {
      setIsLoading(false);
    }
  };

  const loadTrendingMovies = async () => {
    try {
      const movies = await getTrendingMoives();
      console.log(movies)
      setTrendingMovies(movies);
    } catch (error) {
      console.error(`Error fetching trending movies: ${error}`);
    }
  };

  useEffect(() => {
    fecthMovies(debouncedSearchTerm);
  }, [debouncedSearchTerm]);

  useEffect(() => {
    loadTrendingMovies();
  }, []);

  return (
    <main className=" flex items-center justify-center flex-col text-white gap-5">
      <img src="src/assets/movie-poster.png" alt="" className="w-70"/>
      <h1 className="text-5xl font-bold mt-0">MOVIEFLIX</h1>
      <Search searchItem={searchItem} setSearchItem={setSearchItem} />


{trendingMovies.length>0 && (
  <section>
    <h2 className="text-4xl font-bold bg-gradient-to-b from-blue-500 to-white bg-clip-text text-transparent text-center mt-10">Trending Movies</h2>
    <ul className="trending">
      {trendingMovies.map((movie,index)=>(
        <li key={movie.$id} className="trendingMovie">
          <p>{index+1}</p>
          <img src={movie.poster_url} alt={movie.title} />
        </li>
      ))}
    </ul>
  </section>
)}
      <section className="flex flex-col gap-5">
        <h1 className="text-center text-4xl font-bold bg-gradient-to-b from-blue-500 to-white bg-clip-text text-transparent mb-10">
          All Movies
        </h1>
        {isLoading ? (
          <Spinner />
        ) : errorMessage ? (
          <p>{errorMessage}</p>
        ) : (
          <ul className="cards">
            {movieList.map((movie) => (
              <MovieCard key={movie.id} movie={movie} />
            ))}
          </ul>
        )}
      </section>
    </main>
  );
};

export default App;
