import { useState } from "react";
import "../styles/Movies.css";

function MovieDetailModal({ movie, onClose }) {
  const [isFavorite, setIsFavorite] = useState(false);

  if (!movie) return null;

  const handleStarClick = () => {
    setIsFavorite(!isFavorite);
  };

  return (
    <div className="movie-detail-backdrop" role="dialog" aria-modal="true" aria-label={`Detalle de ${movie.title}`}>
      <div className="movie-detail-modal">
        <div className="movie-detail-poster">
          {movie.image_url ? (
            <img src={movie.image_url} alt={movie.title} />
          ) : (
            <div className="no-image">Sin imagen</div>
          )}
        </div>

        <div className="movie-detail-body">
          <header className="movie-detail-header">
            <div className="movie-detail-title-section">
              <p className="movie-detail-meta">{movie.year} • {movie.genre || ""}</p>
              <div className="movie-title-with-star">
                <h3 className="movie-detail-title">{movie.title}</h3>
                <button
                  className={`movie-star-toggle ${isFavorite ? "filled" : "empty"}`}
                  onClick={handleStarClick}
                  aria-label={isFavorite ? "Quitar de favoritos" : "Añadir a favoritos"}
                  title={isFavorite ? "Quitar de favoritos" : "Añadir a favoritos"}
                >
                  {isFavorite ? "★" : "☆"}
                </button>
              </div>
            </div>
            <button className="movie-detail-close" onClick={onClose} aria-label="Cerrar detalle">
              ×
            </button>
          </header>

          <div className="movie-detail-rating">⭐ {movie.stars ?? "N/A"}</div>

          <p className="movie-detail-description">{movie.description || "Sin descripción disponible."}</p>
        </div>
      </div>
    </div>
  );
}

export default MovieDetailModal;
