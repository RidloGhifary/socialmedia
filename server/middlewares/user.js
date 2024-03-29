import jwt from "jsonwebtoken";

export const verifyToken = (req, res, next) => {
  try {
    const token = req.header("Authorization");
    if (!token) res.status(403).send("Access Denied");

    if (token.startsWith("Bearer "))
      token = token.slice(7, token.length).trimLeft();

    const verified = jwt.verify(token, process.env.JWT_TOKEN_SECRET);
    req.user = verified;
    next();
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
