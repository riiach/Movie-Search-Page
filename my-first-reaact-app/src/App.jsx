import { useEffect, useState } from "react";
import Search from "./components/Search.jsx";
import Spinner from "./components/Spinner.jsx";
import MovieCard from "./components/MovieCard.jsx";
import { updateSearchCount } from "./appwrite.js";

const API_BASE_URL = "https://api.themoviedb.org/3";

const API_KEY = import.meta.env.VITE_TMDB_API_KEY;

const API_OPTIONS = {
  method: "GET",
  headers: {
    accept: "application/json",
    Authorization: `Bearer ${API_KEY}`,
  },
};

const App = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
  const [movieList, setMovieList] = useState([]);
  const [isLoading, setIsLoading] = useState(false);

  const fetchMovies = async (query = "") => {
    setIsLoading(true);
    setErrorMessage("");

    try {
      const endpoint = query
        ? `${API_BASE_URL}/search/movie?query=${encodeURI(query)}`
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
      console.error(`Error fetching movies: ${error}`);
      setErrorMessage("Error fetching movies. Please try again later.");
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchMovies(searchTerm);
  }, [searchTerm]);

  return (
    <main>
      <section className="cinema-hero" aria-labelledby="hero-title">
        <nav className="navigation" aria-label="Main navigation">
          <a className="wordmark" href="#">
            MOVIE<span>SEARCH</span>
            <i />
          </a>
          <a className="nav-link" href="#movies">
            Explore movies <span>↗</span>
          </a>
        </nav>
        <header className="cinema-screen">
          <p className="eyebrow">
            <span /> A LITTLE DISCOVERY. A GREAT MOVIE.
          </p>
          <h1 id="hero-title">
            Find your next
            <br />
            <em>opening night.</em>
          </h1>
          <p className="hero-description">
            For the stories that stay with you.
            <br />
            Discover something worth settling in for.
          </p>
          <Search searchTerm={searchTerm} setSearchTerm={setSearchTerm} />
          <p className="screen-caption">
            THOUSANDS OF STORIES. ONE PERFECT PICK.
          </p>
        </header>
        <img
          className="cinema-seats"
          src="/cinema-seats.png"
          alt=""
          aria-hidden="true"
        />
        <div className="hero-bottom">
          <span>TAKE A SEAT. FIND YOUR STORY.</span>
          <a href="#movies" aria-label="Browse movies">
            ↓
          </a>
          <span>THE SEARCH IS PART OF THE MAGIC.</span>
        </div>
      </section>
      <section
        className="all-movies"
        id="movies"
        aria-labelledby="movies-title"
      >
        <div className="section-heading">
          <div>
            <p className="eyebrow">THE COLLECTION</p>
            <h2 id="movies-title">
              {searchTerm ? "Your search, on screen." : "Worth a closer look."}
            </h2>
          </div>
          <span className="collection-label">
            {searchTerm ? `Results for “${searchTerm}”` : "Popular right now"}{" "}
            <span>↘</span>
          </span>
        </div>
        {isLoading ? (
          <Spinner />
        ) : errorMessage ? (
          <p className="status-message" role="alert">
            {errorMessage}
          </p>
        ) : movieList.length === 0 ? (
          <p className="status-message">No movies found. Try another title.</p>
        ) : (
          <ul>
            {movieList.map((movie) => (
              <li key={movie.id}>
                <MovieCard movie={movie} />
              </li>
            ))}
          </ul>
        )}
      </section>
      <footer>
        <a className="wordmark" href="#">
          MOVIE<span>SEARCH</span>
          <i />
        </a>
        <p>A good night starts with a great story.</p>
        <span>Movie data by TMDB</span>
      </footer>
    </main>
  );
};
export default App;
