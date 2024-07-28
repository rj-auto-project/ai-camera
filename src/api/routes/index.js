import express from "express";

import authRoutes from "./auth.routes.js";

const router = express.Router();

router.use("/auth", authRoutes);

router.get("/status", (req, res) => {
  res.json({ status: "ok" });
});

router.all("*", (req, res) => {
  res.status(404).json({ message: "Not Found" });
});

export default router;
