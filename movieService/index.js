const express = require("express");
const cors = require("cors");

const { importMovies, getMovies, addMovie } = require("./routes/movies");
const db = require("./db");

const app = express();
app.use(cors());
app.use(express.json());

app.get("/movies", getMovies);
app.post("/movies", addMovie);

async function start() {
  let attempts = 0;
  const maxAttempts = 30;
  
  while (attempts < maxAttempts) {
    try {
      // Verificar conexión a MySQL
      const conn = await db.getConnection();
      console.log("✅ Conectado a MySQL exitosamente");
      conn.release();
      
      // Importar películas
      await importMovies();
      console.log("📥 Películas importadas correctamente");
      
      // Escuchar en el puerto
      app.listen(3001, () => {
        console.log("🎬 API escuchando en puerto 3001");
      });
      return;
    } catch (err) {
      attempts++;
      console.log(`⏳ Intento ${attempts}/${maxAttempts}: ${err.message}`);
      if (attempts >= maxAttempts) {
        console.error("❌ No se pudo conectar a MySQL después de 30 intentos");
        process.exit(1);
      }
      await new Promise(resolve => setTimeout(resolve, 2000));
    }
  }
}

start();


