import jwt from "jsonwebtoken";

export async function generateToken(user) {
  const { employeeId, name } = user;

  const token = jwt.sign({ employeeId, name }, process.env.JWT_SECRET, {
    expiresIn: "1h",
  });

  return token;
}
