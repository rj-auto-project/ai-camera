import { register, login } from "../services/auth.service.js";

const registerUser = async (req, res, next) => {
  try {
    const user = await register(req.body);
    res.status(201).json(user);
  } catch (error) {
    next(error);
  }
};

const loginUser = async (req, res, next) => {
  try {
    const token = await login(req.body);
    res.status(200).json({ token });
  } catch (error) {
    next(error);
  }
};

export { registerUser, loginUser };
