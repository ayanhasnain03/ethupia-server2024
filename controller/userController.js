import asyncHandler from "../middleware/asyncHandler.js";
import ErrorHandler from "../utils/errorHandler.js";

const registerUser = asyncHandler(async (req, res, next) => {
  const { username, email, password } = req.body;

  console.log(username);
  res.status(200).json({ message: "Register User" });
});
export { registerUser };
