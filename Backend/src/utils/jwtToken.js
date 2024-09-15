import jwt from "jsonwebtoken";

export async function generateToken(user) {
  const { employee_Id, name, access_level } = user;

  const accessToken = jwt.sign({ employee_Id, name, access_level }, process.env.JWT_SECRET, {
    expiresIn: "15m",
  });

  const refreshToken = jwt.sign({ employee_Id, name, access_level }, process.env.JWT_SECRET, {
    expiresIn: "7d",
  });

  return { accessToken, refreshToken };
}
