import jwt from "jsonwebtoken";

const authMiddleware = (req, res, next) => {
  let token = req.header("Authorization")?.replace("Bearer ", "");
  if (!token) {
    token = req.query.token;
  }

  if (!token) {
    return res.status(401).json({ error: "Authentication required" });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.userId = decoded?.employee_Id;
    next();
  } catch (err) {
    res.status(401).json({ error: "Invalid token" });
  }
};

export default authMiddleware;
