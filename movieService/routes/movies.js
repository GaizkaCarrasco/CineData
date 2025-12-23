const express = require("express");
const router = express.Router();
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

module.exports = router;
