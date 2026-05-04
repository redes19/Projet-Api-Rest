import express from "express";
import "reflect-metadata";
import { AppDataSource } from "./database/database.js";
import { initHandlers } from "./routes.js";
import { swaggerDocs } from "./swagger/swagger.js";
import { seedAllData, seedMovies, seedRooms, seedScreenings, seedUsers } from "./database/seed.js";

const app = express();
const PORT = process.env.PORT || 3000;
const SEED_DATA = process.env.SEED_DATA === "true";
const CLEAR_DB = process.env.CLEAR_DB === "true";
app.use(express.json());

initHandlers(app);

swaggerDocs(app, PORT);

if (CLEAR_DB) {
  try {
    await AppDataSource.initialize();
    await AppDataSource.dropDatabase();
    await AppDataSource.destroy();
    console.log("Base de données effacée avec succès.");
  } catch (error) {
    console.error("Erreur lors de l'effacement de la base de données :", error);
    process.exit(1);
  }
}

try {
  await AppDataSource.initialize();
} catch (error) {
  console.log(error);
  console.log("Erreur BDD : Initialization failed");
  process.exit(1);
}

if (SEED_DATA) {
  try {
    await seedUsers();
    const movies = await seedMovies();
    const rooms = await seedRooms();
    await seedScreenings(movies, rooms);
    console.log("\n Seed terminé avec succès");
  } catch (error) {
    console.error("Erreur lors du seed de la base de données :", error);
    process.exit(1);
  }
}

app.listen(PORT, () => {
  console.log("Application disponible au port " + PORT);
});
