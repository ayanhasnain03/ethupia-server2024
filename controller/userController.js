import asyncHandler from "../middleware/asyncHandler.js";
import userModel from "../model/userModel.js";
import ErrorHandler from "../utils/errorHandler.js";

const registerUser = asyncHandler(async (req, res, next) => {
  const { userName, email, password } = req.body;
  if (!userName || !email || !password) {
    return next(new ErrorHandler("Please enter all fields", 400));
  }
  const user = await userModel.create({
    userName,
    email,
    password,
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
