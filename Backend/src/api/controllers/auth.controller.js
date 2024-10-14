import { register, login } from "../services/auth.service.js";

const registerUser = async (req, res, next) => {
  try {
    const userData = await register(req.body);
    res.status(201).json({ userData });
  } catch (error) {
    next(error);
  }
};

const loginUser = async (req, res, next) => {
  try {
    const userData = await login(req.body);
    res.status(200).json({ userData });
  } catch (error) {
    next(error);
  }
};

export { registerUser, loginUser };
