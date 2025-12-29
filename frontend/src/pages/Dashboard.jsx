import React, { useState, useEffect } from "react";
import LogoutButton from "../components/LogoutButton";
import Logo from "../components/Logo";
import SearchBar from "../components/SearchBar";
import FavoritesButton from "../components/FavoritesButton";
import FilterBar from "../components/FilterBar";
import MovieDetailModal from "../components/MovieDetailModal";
import axios from "axios";
import "../styles/Movies.css";

// Usar el API Gateway como punto de entrada
const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:8080';

function Dashboard() {
  const token = localStorage.getItem("token");

  // Estado para almacenar las películas
  const [peliculas, setPeliculas] = useState([]);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [filters, setFilters] = useState({
    genre: "",
    year: "",
    rating: "",
  });
  const [favoritesActive, setFavoritesActive] = useState(false);
  const [selectedMovie, setSelectedMovie] = useState(null);
  const [favorites, setFavorites] = useState([]);

  useEffect(() => {
    if (token) {
      // Realiza la solicitud solo si el usuario está autenticado
      axios
        .get(`${API_URL}/movies`)
        .then((response) => {
          setPeliculas(response.data);
        })
        .catch((err) => {
          setError("Error al cargar las películas");
          console.error(err);
        });
    }
  }, [token]); // Ejecuta este efecto solo cuando el token cambie

  useEffect(() => {
    if (!token) return;

    const fetchProfile = async () => {
      try {
        const response = await axios.get(`${API_URL}/users/me`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        setFavorites(response.data.favorites || []);
      } catch (err) {
        console.error(err);
        setError("No se pudieron cargar tus favoritos");
      }
    };

    fetchProfile();
  }, [token]);

  // Filtrar películas según el término de búsqueda (solo en título)
  const peliculasFiltradas = peliculas.filter((peli) => {
    // Filtro de búsqueda por título
    if (searchTerm && !peli.title.toLowerCase().includes(searchTerm.toLowerCase())) {
      return false;
    }

    // Filtro por género
    if (filters.genre && peli.genre !== filters.genre) {
      return false;
    }

    // Filtro por año
    if (filters.year && peli.year !== parseInt(filters.year)) {
      return false;
    }

    // Filtro por valoración (stars >= rating)
    if (filters.rating) {
      const minRating = parseInt(filters.rating);
      const movieRating = parseFloat(peli.stars);
      if (movieRating < minRating) {
        return false;
      }
    }

    return true;
  });

  const peliculasFinales = favoritesActive
    ? peliculasFiltradas.filter((peli) => favorites.includes(peli.id))
    : peliculasFiltradas;

  const handleFilterChange = ({ filterType, value }) => {
    setFilters((prev) => ({
      ...prev,
      [filterType]: value,
    }));
  };

  const handleMovieClick = (movie) => {
    setSelectedMovie(movie);
  };

  const handleCloseDetail = () => {
    setSelectedMovie(null);
  };

  const handleToggleFavorite = async (movieId) => {
    if (!token || !movieId) return;

    const isFav = favorites.includes(movieId);
    const url = `${API_URL}/favorites/${movieId}`;

    try {
      if (isFav) {
        await axios.delete(url, { headers: { Authorization: `Bearer ${token}` } });
        setFavorites((prev) => prev.filter((id) => id !== movieId));
      } else {
        await axios.post(url, {}, { headers: { Authorization: `Bearer ${token}` } });
        setFavorites((prev) => [...prev, movieId]);
      }
    } catch (err) {
      console.error(err);
      setError("No se pudo actualizar favoritos");
    }
  };

  if (!token) {
    return <p>No estás autenticado</p>;
  }

  return (
    <div className="movies-page">
      {/* BLOQUE 1: Navegación/Logo */}
      <header className="movies-topbar">
        <div className="topbar-main">
          <Logo />
          <FavoritesButton active={favoritesActive} onToggle={() => setFavoritesActive((prev) => !prev)} />
          <SearchBar onSearch={setSearchTerm} />
          <LogoutButton />
        </div>
        <div className="topbar-filters">
          <FilterBar onFilterChange={handleFilterChange} movies={peliculas} />
        </div>
      </header>

      {/* BLOQUE 2: Espacio para Futura Barra de Búsqueda */}
      <section className="search-container">
        {/* Aquí irá tu componente de búsqueda */}
      </section>

      {/* BLOQUE 3: Título y Descripción */}
      <div className="movies-heading">
        <h2>Catálogo de películas</h2>
        <p>Explora el catálogo. Pasa el mouse para ver más detalles.</p>
      </div>

      {error && <div className="error-banner">{error}</div>}

      {peliculasFinales.length === 0 ? (
        <p className="empty-state">{searchTerm ? "No se encontraron películas." : "No hay películas disponibles."}</p>
      ) : (
        <main className="movies-grid">
          {peliculasFinales.map((peli) => (
            <div
              key={peli.id}
              className="movie-card"
              onClick={() => handleMovieClick(peli)}
              role="button"
              tabIndex={0}
              onKeyDown={(e) => {
                if (e.key === "Enter" || e.key === " ") {
                  e.preventDefault();
                  handleMovieClick(peli);
                }
              }}
            >
              <div className="movie-poster">
                {peli.image_url ? (
                  <img src={peli.image_url} alt={peli.title} />
                ) : (
                  <div className="no-image">Sin imagen</div>
                )}

                <div className="movie-overlay">
                  <div className="movie-meta">
                    <span className="movie-year">{peli.year || ""}</span>
                    <span className="movie-genre">{peli.genre || ""}</span>
                  </div>
                  <div className="movie-stars">⭐ {peli.stars ?? "N/A"}</div>
                  <p className="movie-description">{peli.description}</p>
                </div>
              </div>
              <div className="movie-title">{peli.title}</div>
            </div>
          ))}
        </main>
      )}

      {selectedMovie && (
        <MovieDetailModal
          movie={selectedMovie}
          onClose={handleCloseDetail}
          isFavorite={favorites.includes(selectedMovie.id)}
          onToggleFavorite={handleToggleFavorite}
        />
      )}
    </div>
  );
}

export default Dashboard;

