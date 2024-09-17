import express from "express";
import { addUser } from "../controllers/admin.controller.js";
import authMiddleware from "../../middleware/authMiddleware.js";

const router = express.Router();

router.post("/add-user", addUser)

// Get the status of route
router.get("/status", (req, res) => {
  res.json({ status: "ok" });
});

export default router;
