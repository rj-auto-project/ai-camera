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
  const newUser = await prisma.user.create({
    data: {
      employee_Id: employeeId,
      name,
      password: hashedPassword,
      access_level: accessLevel || ACCESSLEVEL.VIEW,
    },
  });

  const { password: _, ...userdata } = newUser;
  const { token, refreshToken } = await generateToken(userdata);

  return {
    ...userdata,
    token,
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

  const { password: __, ...user } = existingUser;
  const { token, refreshToken } = await generateToken(user);

  return {
    ...user,
    token,
    refreshToken,
  };
};

export { register, login };
