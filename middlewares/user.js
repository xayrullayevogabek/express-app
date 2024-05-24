import jwt from "jsonwebtoken";
import User from "../models/User.model.js";

export default async function (req, res, next) {
  if (!req.cookies.token) {
    next();
    return;
  }

  const token = req.cookies.token;
  const decodedToken = jwt.verify(token, process.env.JWT_SECRET);
  const user = await User.findById(decodedToken.userId);
  req.userId = user._id;
  
  next();
}
