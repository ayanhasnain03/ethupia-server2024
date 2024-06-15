import asyncHandler from "../middleware/asyncHandler.js";
import userModel from "../model/userModel.js";
import ErrorHandler from "../utils/errorHandler.js";
import bcrypt from "bcryptjs";
const registerUser = asyncHandler(async (req, res, next) => {
  const { userName, email, password } = req.body;
  const userAlreadyExist = await userModel.findOne({ email });
  if (userAlreadyExist) {
    return next(new ErrorHandler("User already exist", 400));
  }
  if (!userName || !email || !password) {
    return next(new ErrorHandler("Please enter all fields", 400));
  }
  const salt = await bcrypt.genSalt(10);
  const hashedPassword = await bcrypt.hash(password, salt);

  const user = await userModel.create({
    userName,
    email,
    password: hashedPassword,
    avatar: {
      public_id: "sample_id",
      url: "sample_url",
    },
  });
  res.status(201).json({
    success: true,
    user,
  });
});
export { registerUser };
