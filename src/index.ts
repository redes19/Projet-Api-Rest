import express from "express";
import "reflect-metadata";
import { AppDataSource } from "./database/database.js";
import { initHandlers } from "./routes.js";
import { swaggerDocs } from "./swagger/swagger.js";

const app = express();
const PORT = process.env.PORT || 3000;
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

app.listen(PORT, () => {
  console.log("Application disponible au port " + PORT);
});
