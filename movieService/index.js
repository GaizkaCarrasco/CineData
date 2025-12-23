const express = require("express");
const cors = require("cors");

const { importMovies, getMovies, addMovie } = require("./routes/movies");

const app = express();
app.use(cors());
app.use(express.json());

app.get("/movies", getMovies);
app.post("/movies", addMovie);

async function start() {
  await importMovies(); // 👈 carga automática al arrancar

  app.listen(3001, () => {
    console.log("🎬 Movie service running on port 3001");
  });
}

start();
