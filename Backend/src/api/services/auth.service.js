import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import prisma from "../../config/prismaClient.js";
import { generateToken } from "../../utils/index.js";
import { ACCESSLEVEL } from "@prisma/client";

const register = async (userData) => {
  const { password, name, employeeId, accessLevel } = userData;

  const alreadyExists = await prisma.user.findFirst({
    where: {
      employee_Id: employeeId,
    },
  });

  if (alreadyExists) {
    throw new Error("User already exists");
  }

  if (accessLevel === ACCESSLEVEL.ADMIN) {
    const checkExistingAdmin = await prisma.user.findFirst({
      where: {
        access_level: ACCESSLEVEL.ADMIN,
      },
    });

    if (checkExistingAdmin) {
      throw new Error("Admin user already exists");
    }
  }

  const hashedPassword = await bcrypt.hash(password, 10);
  const user = await prisma.user.create({
    data: {
      employee_Id: employeeId,
      name,
      password: hashedPassword,
      access_level: accessLevel || ACCESSLEVEL.VIEW,
    },
  });

  const { accessToken, refreshToken } = await generateToken(user);

  return {
    employeeId: user.employee_Id,
    name: user.name,
    accessToken,
    refreshToken,
  };
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

  const { accessToken, refreshToken } = generateToken(existingUser);

  return {
    employeeId: existingUser.employee_Id,
    name: existingUser.name,
    accessToken,
    refreshToken,
  };
};

export { register, login };
