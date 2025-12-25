import React, { useState, useEffect } from "react";
import LogoutButton from "../components/LogoutButton";
import Logo from "../components/Logo";
import SearchBar from "../components/SearchBar";
import axios from "axios";
import "../styles/Movies.css";

function Dashboard() {
  const token = localStorage.getItem("token");

  // Estado para almacenar las películas
  const [peliculas, setPeliculas] = useState([]);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");

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
  const peliculasFiltradas = peliculas.filter((peli) =>
    peli.title.toLowerCase().includes(searchTerm.toLowerCase())
  );

  if (!token) {
    return <p>No estás autenticado</p>;
  }

  return (
    <div className="movies-page">
      {/* BLOQUE 1: Navegación/Logo */}
      <header className="movies-topbar">
        <Logo />
        <SearchBar onSearch={setSearchTerm} />
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

