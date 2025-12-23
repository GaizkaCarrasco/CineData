const express = require("express");
const cors = require("cors");

const moviesRoutes = require("./routes/movies");

const app = express();
app.use(cors());
app.use(express.json());

app.use("/movies", moviesRoutes);

app.listen(3001, () => {
  console.log("🎬 Movie service running on http://localhost:3001");
});
