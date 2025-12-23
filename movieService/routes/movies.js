const axios = require("axios");
const db = require("../db");

/* ===========================
   IMPORTACIÓN AUTOMÁTICA
=========================== */

async function importMovies() {
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
