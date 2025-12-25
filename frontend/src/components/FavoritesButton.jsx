import "../styles/FavoritesButton.css";

function FavoritesButton({ active = false, onToggle }) {
  return (
    <button
      type="button"
      className={`favorites-btn ${active ? "is-active" : ""}`}
      onClick={onToggle}
      aria-pressed={active}
      title="Favoritos"
    >
      <span className={`star ${active ? "filled" : "outline"}`}>{active ? "★" : "☆"}</span>
      <span className="label">Favoritos</span>
    </button>
  );
}

export default FavoritesButton;
