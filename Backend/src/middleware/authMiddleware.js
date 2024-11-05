import jwt from "jsonwebtoken";

const authMiddleware = (req, res, next) => {
  let token = req.header("Authorization")?.replace("Bearer ", "");
  console .log("Token", token);
  if (!token) {
    token = req.query.token;
  }

  if (!token) {
    return res.status(401).json({ error: "Authentication required" });
  }

  console.log("Token", token);

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    console.log("Decoded", decoded);
    req.userId = decoded?.employee_Id;
    next();
  } catch (err) {
    res.status(401).json({ error: "Invalid token" });
  }
};

export default authMiddleware;
