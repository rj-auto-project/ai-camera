import express from "express";
import bodyParser from "body-parser";
import cors from "cors";
import dotenv from "dotenv";

import routes from "./api/routes/index.js";
import { errorHandler } from "./middleware/index.js";

dotenv.config();

const app = express();
const port = process.env.PORT || 3000;

app.use(cors());
app.use(bodyParser.json());

app.use("/api/v1", routes);
app.use(errorHandler);

app.get("/", (req, res) => {
  res.send("Welcome to the API");
});

app.listen(port, async () => {
  console.log(`Server is running on http://localhost:${port}`);
});
