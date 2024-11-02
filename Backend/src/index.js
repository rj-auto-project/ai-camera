import express from "express";
import bodyParser from "body-parser";
import cors from "cors";
import dotenv from "dotenv";

import routes from "./api/routes/index.js";
import { errorHandler } from "./middleware/index.js";

const envFile = process.env.NODE_ENV === "prod" ? `.env.prod` : ".env.dev";
dotenv.config({ path: envFile });
console.log(`Environment: ${envFile}`);

const app = express();
const port = process.env.PORT || 4000;

app.use(cors());
app.use(bodyParser.json());

app.use("/api/v1", routes);
app.use(errorHandler);

app.get("/", (req, res) => {
  res.status(200).json({ message: "Welcome to the Express API" });
});

app.listen(port, async () => {
  console.log(`Server is running on http://localhost:${port}`);
});

export default app;
