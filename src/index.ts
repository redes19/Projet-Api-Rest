import express from "express";
import "reflect-metadata";
import { AppDataSource } from "./database/database.js";
import { initHandlers } from "./routes.js";
import { swaggerDocs } from "./swagger/swagger.js";
import { seedAllData } from "./database/seed.js";

const app = express();
const PORT = process.env.PORT || 3000;
const SEED_DATA = process.env.SEED_DATA === "true";
const CLEAR_DB = process.env.CLEAR_DB === "true";
app.use(express.json());

initHandlers(app);

swaggerDocs(app, PORT);

try {
  await AppDataSource.initialize();
} catch (error) {
  console.log(error);
  console.log("Erreur BDD : Initialization failed");
  process.exit(1);
}

if (CLEAR_DB) {
  try {
    await AppDataSource.dropDatabase();
    console.log("Base de données effacée avec succès.");
  } catch (error) {
    console.error("Erreur lors de l'effacement de la base de données :", error);
    process.exit(1);
  }
}

if (SEED_DATA) {
  try {
    await seedAllData();
  } catch (error) {
    console.error("Erreur lors du seed de la base de données :", error);
    process.exit(1);
  }
}

app.listen(PORT, () => {
  console.log("Application disponible au port " + PORT);
});
