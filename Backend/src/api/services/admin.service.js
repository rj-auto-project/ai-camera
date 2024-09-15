import bcrypt from "bcryptjs";
import prisma from "../../config/prismaClient.js";
import { ACCESSLEVEL } from "@prisma/client";

const checkIfAdmin = async (userId) => {
  const user = await prisma.user.findFirst({
    where: {
      employee_Id: userId,
    },
  });

  if (!user) {
    return false;
  }

  if (user?.access_level !== ACCESSLEVEL.ADMIN) {
    return false;
  }

  return true;
};

const addUserService = async (userData) => {
  if (userData?.access_level === ACCESSLEVEL.ADMIN)
    throw new Error("Admin cannot be added");

  const checkIfUserExists = await prisma.user.findFirst({
    where: {
      employee_Id: userData?.employee_Id,
    },
  });

  if (checkIfUserExists) {
    throw new Error("User already exists");
  }

  const hashedPassword = await bcrypt.hash(userData?.password, 10);

  const newUser = await prisma.user.create({
    data: {
      name: userData?.name,
      employee_Id: userData?.employee_Id,
      password: hashedPassword,
      access_level: userData?.access_level,
    },
  });

  const { password, ...userWithoutPassword } = newUser;

  return userWithoutPassword;
};

export { checkIfAdmin, addUserService };
