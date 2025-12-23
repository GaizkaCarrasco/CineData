const express = require("express");
const router = express.Router();
const axios = require("axios");
const db = require("../db");

router.post("/", async (req, res) => {
  const { external_id, title, description, year, image_url, genre, stars } = req.body;

  try {
    await db.query(
      `INSERT INTO movies (external_id, title, description, year, image_url, genre, stars)
       VALUES (?, ?, ?, ?, ?, ?, ?)`,
      [external_id, title, description, year, image_url, genre, stars]
    );

    res.status(201).json({ message: "Movie saved" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

router.post("/import", async (req, res) => {
  try {
    //Llamada a la API externa
    const response = await axios.get(
      "https://devsapihub.com/api-movies"
    );

    const movies = response.data;

    //Guardar cada película
    for (const movie of movies) {
      await db.query(
        `INSERT IGNORE INTO movies 
        (external_id, title, description, year, image_url, genre, stars)
        VALUES (?, ?, ?, ?, ?, ?, ?)`,
        [
          movie.id,
          movie.title,
          movie.description,
          movie.year,
          movie.image_url,
          movie.genre,
          movie.stars,
        ]
      );
    }

    res.json({
      message: "Películas importadas correctamente",
      total: movies.length,
    });

  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;
