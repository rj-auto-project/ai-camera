import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";

const register = async (userData) => {
  const { email, password, name } = userData;
  //TODO: Check if user exists in DB, if exists(return/throw err) if not(proceed)
  const hashedPassword = await bcrypt.hash(password, 10);
  //TODO: Save user data to DB

  const user = {
    email,
    name,
  };

  return user;
};

const login = async (userData) => {
  const { email, password } = userData;
  //TODO: Check if user exists in DB, if exists(return/throw err) if not(proceed)
  const user = {
    email,
    name: "dummyName",
    id: 1,
  };
  // const isMatch = await bcrypt.compare(password, "hashedPassword");
  // if (!isMatch) {
  //   throw new Error("Invalid credentials");
  // }
  const token = jwt.sign({ userId: user.id }, process.env.JWT_SECRET, {
    expiresIn: "1h",
  });
  return token;
};

export { register, login };
