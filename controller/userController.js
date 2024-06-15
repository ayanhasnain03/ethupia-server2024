import asyncHandler from "../middleware/asyncHandler.js";
import userModel from "../model/userModel.js";
import ErrorHandler from "../utils/errorHandler.js";
import bcrypt from "bcryptjs";
import generateToken from "../utils/Jwt.js";
import setToken from "../utils/setToken.js";
const registerUser = asyncHandler(async (req, res, next) => {
  const { userName, email, password } = req.body;
  if (role && role === "admin") {
    return res.status(403).send("Cannot register as admin");
  }
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

  const token = generateToken(user);
  setToken(token, res);
  res.status(201).json({
    success: true,
    message: `Welcome ${user.userName}`,
  });
});
const loginUser = asyncHandler(async (req, res, next) => {
  const { email, password } = req.body;
  if (!email || !password) {
    return next(new ErrorHandler("Please enter all fields", 400));
  }
  const user = await userModel.findOne({ email }).select("+password");
  if (!user) {
    return next(new ErrorHandler("Invalid email or password", 401));
  }
  const isPasswordMatched = await bcrypt.compare(password, user.password);
  if (!isPasswordMatched) {
    return next(new ErrorHandler("Invalid email or password", 401));
  }
  const token = generateToken(user);
  setToken(token, res);
  res.status(200).json({
    success: true,
    message: `Welcome back ${user.userName}`,
  });
});
const logoutUser = asyncHandler(async (req, res, next) => {
  res
    .status(200)
    .cookie("token", null, {
      expires: new Date(Date.now()),
      httpOnly: true,
      secure: true,
      sameSite: "none",
    })
    .json({
      success: true,
      message: "Logged Out",
    });
});

export { registerUser, loginUser, logoutUser };
