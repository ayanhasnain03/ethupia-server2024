// authMiddleware.js
import jwt from "jsonwebtoken";
import User from "../model/userModel.js";
import ErrorHandler from "../utils/errorHandler.js";

export const isAuthenticated = async (req, res, next) => {
  try {
    const token = req.cookies.token;
    if (!token) {
      throw new ErrorHandler("Login first to access this resource", 401);
    }
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = await User.findById(decoded.userId);
    if (!req.user) {
      throw new ErrorHandler("User not found", 404);
    }
    next();
  } catch (error) {
    next(error);
  }
};
