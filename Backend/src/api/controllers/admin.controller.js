import { addUserService, checkIfAdmin } from "../services/admin.service.js";

const addUser = async (req, res) => {
  const { name, employee_Id, password, access_level } = req.body;
  const userId = req.userId;
  if (!name || !employee_Id || !password || !access_level) {
    return res.status(400).json({
      message: "All fields are required",
    });
  }

  if (!userId) {
    return res.status(401).json({
      message: "Unauthorized",
    });
  }

  try {
    const isAdmin = await checkIfAdmin(userId);

    if (!isAdmin) {
      return res.status(401).json({
        message: "You are not authorized to add users",
      });
    }

    const newUser = await addUserService(req.body);

    return res.status(201).json({
      message: "User created successfully",
      user: newUser,
    });
  } catch (error) {
    return res.status(500).json({
      message: "Internal server error",
      error: error.message,
    });
  }
};

export { addUser };
