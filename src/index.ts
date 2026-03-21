import express from "express";
import { AppdDataSource } from "./database/database.js";
import { initHandlers } from "./handlers/routes.js";

const app = express();
const PORT = process.env.PORT || 3000;
app.use(express.json());

initHandlers(app);

try {
  await AppdDataSource.initialize();
} catch (error) {
  console.log(error);
  console.log("Erreur BDD : Initialization failed");
  process.exit(1);
}

app.listen(PORT, () => {
  console.log("Application disponible au port " + PORT);
});
