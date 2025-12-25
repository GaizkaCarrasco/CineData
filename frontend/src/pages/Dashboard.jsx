import React, { useState, useEffect } from "react";
import LogoutButton from "../components/LogoutButton";
import Logo from "../components/Logo";
import SearchBar from "../components/SearchBar";
import FavoritesButton from "../components/FavoritesButton";
import FilterBar from "../components/FilterBar";
import axios from "axios";
import "../styles/Movies.css";

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

  useEffect(() => {
    if (token) {
      // Realiza la solicitud solo si el usuario está autenticado
      axios
        .get("http://localhost:3001/movies")
        .then((response) => {
          setPeliculas(response.data);
        })
        .catch((err) => {
          setError("Error al cargar las películas");
          console.error(err);
        });
    }
  }, [token]); // Ejecuta este efecto solo cuando el token cambie

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

  const handleFilterChange = ({ filterType, value }) => {
    setFilters((prev) => ({
      ...prev,
      [filterType]: value,
    }));
  };

  if (!token) {
    return <p>No estás autenticado</p>;
  }

  return (
    <div className="movies-page">
      {/* BLOQUE 1: Navegación/Logo */}
      <header className="movies-topbar">
        <Logo />
        <FavoritesButton active={favoritesActive} onToggle={() => setFavoritesActive((prev) => !prev)} />
        <SearchBar onSearch={setSearchTerm} />
        <FilterBar onFilterChange={handleFilterChange} movies={peliculas} />
        <LogoutButton />
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

      {peliculasFiltradas.length === 0 ? (
        <p className="empty-state">{searchTerm ? "No se encontraron películas." : "No hay películas disponibles."}</p>
      ) : (
        <main className="movies-grid">
          {peliculasFiltradas.map((peli) => (
            <div key={peli.id} className="movie-card">
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
    </div>
  );
}

export default Dashboard;

