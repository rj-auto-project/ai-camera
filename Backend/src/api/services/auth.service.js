import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import prisma from "../../config/prismaClient.js";
import { generateToken } from "../../utils/index.js";

const register = async (userData) => {
  const { password, name, employeeId } = userData;

  const alreadyExists = await prisma.user.findFirst({
    where: {
      employee_Id: employeeId,
    },
  });

  if (alreadyExists) {
    throw new Error("User already exists");
  }

  const hashedPassword = await bcrypt.hash(password, 10);
  const user = await prisma.user.create({
    data: {
      employee_Id: employeeId,
      name,
      password: hashedPassword,
    },
  });

  return { employeeId: user.employee_Id, name: user.name };
};

const login = async (userData) => {
  const { employeeId, password } = userData;

  const existingUser = await prisma.user.findFirst({
    where: {
      employee_Id: employeeId,
    },
  });

  if (!existingUser) {
    throw new Error("User not found");
  }

  const isPasswordValid = await bcrypt.compare(password, existingUser.password);

  if (!isPasswordValid) {
    throw new Error("Invalid password");
  }

  const token = generateToken(existingUser);

  return token;
};

export { register, login };
