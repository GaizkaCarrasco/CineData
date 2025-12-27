const axios = require("axios");
const db = require("../db");

/* ===========================
   CREAR TABLA SI NO EXISTE
=========================== */

async function ensureTableExists() {
  const createTableQuery = `
    CREATE TABLE IF NOT EXISTS movies (
      id INT AUTO_INCREMENT PRIMARY KEY,
      external_id INT UNIQUE,
      title VARCHAR(255) NOT NULL,
      description TEXT,
      year INT,
      image_url VARCHAR(500),
      genre VARCHAR(100),
      stars DECIMAL(3, 1)
    ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci
  `;
  
  try {
    await db.query(createTableQuery);
    console.log("✅ Tabla 'movies' verificada/creada");
  } catch (err) {
    console.error("❌ Error al crear tabla:", err.message);
    throw err;
  }
}

/* ===========================
   IMPORTACIÓN AUTOMÁTICA
=========================== */

async function importMovies() {
  await ensureTableExists();
  
  const response = await axios.get("https://devsapihub.com/api-movies");
  const movies = response.data;

  for (const m of movies) {
    await db.query(
      `INSERT IGNORE INTO movies
      (external_id, title, description, year, image_url, genre, stars)
      VALUES (?, ?, ?, ?, ?, ?, ?)`,
      [
        m.id,
        m.title,
        m.description,
        m.year,
        m.image_url,
        m.genre,
        m.stars
      ]
    );
  }

  console.log("📥 Películas importadas automáticamente");
}

/* ===========================
   GET /movies
=========================== */

async function getMovies(req, res) {
  const [rows] = await db.query("SELECT * FROM movies");
  res.json(rows);
}

/* ===========================
   POST /movies (manual)
=========================== */

async function addMovie(req, res) {
  const { external_id, title, description, year, image_url, genre, stars } = req.body;

  try {
    await db.query(
      `INSERT INTO movies
      (external_id, title, description, year, image_url, genre, stars)
      VALUES (?, ?, ?, ?, ?, ?, ?)`,
      [external_id, title, description, year, image_url, genre, stars]
    );

    res.status(201).json({ message: "Película añadida correctamente" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
}

module.exports = { importMovies, getMovies, addMovie };
