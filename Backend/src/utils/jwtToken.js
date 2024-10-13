import jwt from "jsonwebtoken";

export async function generateToken(user) {
  const { employee_Id, name, access_level } = user;

  const token = jwt.sign(
    { employee_Id, name, access_level },
    process.env.JWT_SECRET,
    {
      expiresIn: "24h",
    },
  );

  const refreshToken = jwt.sign(
    { employee_Id, name, access_level },
    process.env.JWT_SECRET,
    {
      expiresIn: "7d",
    },
  );

  return { token, refreshToken };
}
