import jwt from "jsonwebtoken";

export async function generateToken(user) {
  const { employee_Id, name } = user;

  const token = jwt.sign({ employee_Id, name }, process.env.JWT_SECRET, {
    expiresIn: "7d",
  });

  return token;
}
