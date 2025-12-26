import "../styles/Movies.css";

function MovieDetailModal({ movie, onClose }) {
  if (!movie) return null;

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
            <div>
              <p className="movie-detail-meta">{movie.year} • {movie.genre || ""}</p>
              <h3 className="movie-detail-title">{movie.title}</h3>
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
