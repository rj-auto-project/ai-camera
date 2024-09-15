import express from "express";
import { registerUser, loginUser } from "../controllers/auth.controller.js";
import {
  registerValidator,
  loginValidator,
} from "../validators/auth.validator.js";

const router = express.Router();

router.post("/register", registerUser);
router.post("/login", loginValidator, loginUser);

// Get the status of Auth route
router.get("/status", (req, res) => {
  res.json({ status: "ok" });
});

export default router;
