import "../styles/FilterBar.css";

function FilterBar({ onFilterChange, movies }) {
  // Extraer valores únicos de películas para los dropdowns
  const getUniqueYears = () => {
    const years = movies.map((m) => m.year).filter(Boolean);
    return [...new Set(years)].sort((a, b) => b - a);
  };

  const getUniqueGenres = () => {
    const genres = movies.map((m) => m.genre).filter(Boolean);
    return [...new Set(genres)].sort();
  };

  const getRatings = () => {
    return ["Todas", "1+", "2+", "3+", "4+", "5"];
  };

  const handleFilterChange = (filterType, value) => {
    onFilterChange({ filterType, value });
  };

  return (
    <div className="filter-bar">
      <div className="filter-group">
        <label htmlFor="genre-filter">Género:</label>
        <select
          id="genre-filter"
          onChange={(e) => handleFilterChange("genre", e.target.value)}
          className="filter-select"
          defaultValue=""
        >
          <option value="">Todos</option>
          {getUniqueGenres().map((genre) => (
            <option key={genre} value={genre}>
              {genre}
            </option>
          ))}
        </select>
      </div>

      <div className="filter-group">
        <label htmlFor="year-filter">Año:</label>
        <select
          id="year-filter"
          onChange={(e) => handleFilterChange("year", e.target.value)}
          className="filter-select"
          defaultValue=""
        >
          <option value="">Todos</option>
          {getUniqueYears().map((year) => (
            <option key={year} value={year}>
              {year}
            </option>
          ))}
        </select>
      </div>

      <div className="filter-group">
        <label htmlFor="rating-filter">Valoración:</label>
        <select
          id="rating-filter"
          onChange={(e) => handleFilterChange("rating", e.target.value)}
          className="filter-select"
          defaultValue=""
        >
          {getRatings().map((rating) => (
            <option key={rating} value={rating === "Todas" ? "" : rating.replace("+", "")}>
              {rating}
            </option>
          ))}
        </select>
      </div>
    </div>
  );
}

export default FilterBar;
