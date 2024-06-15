import asyncHandler from "../middleware/asyncHandler.js";
import userModel from "../model/userModel.js";
import ErrorHandler from "../utils/errorHandler.js";
import bcrypt from "bcryptjs";
import generateToken from "../utils/Jwt.js";
import setToken from "../utils/setToken.js";
import sendEmail from "../utils/sendEmail.js";
import crypto from "crypto";
import getDataUri from "../utils/dataUri.js";
import cloudinary from "cloudinary";
const registerUser = asyncHandler(async (req, res, next) => {
  const file = req.file;
  const { userName, email, password } = req.body;

  // Check if user already exists
  const userAlreadyExist = await userModel.findOne({ email });
  if (userAlreadyExist) {
    return next(new ErrorHandler("User already exists", 400));
  }

  // Check if all fields are provided
  if (!userName || !email || !password) {
    return next(new ErrorHandler("Please enter all fields", 400));
  }

  // Hash the password
  const salt = await bcrypt.genSalt(10);
  const hashedPassword = await bcrypt.hash(password, salt);
  const fileUri = getDataUri(file);
  const myCloud = await cloudinary.v2.uploader.upload(fileUri.content);

  const user = await userModel.create({
    userName,
    email,
    password: hashedPassword,
    avatar: {
      public_id: myCloud.public_id,
      url: myCloud.secure_url,
    },
    role: "user",
  });

  // Generate token
  const token = generateToken(user);

  // Set token in cookie
  setToken(token, res);

  res.status(201).json({
    success: true,
    message: `Welcome ${user.userName}`,
  });
});
// Login User
const loginUser = asyncHandler(async (req, res, next) => {
  const { email, password } = req.body;

  // Check if email and password are provided
  if (!email || !password) {
    return next(new ErrorHandler("Please enter all fields", 400));
  }

  // Find the user by email
  const user = await userModel.findOne({ email }).select("+password");

  if (!user) {
    return next(new ErrorHandler("Invalid email or password", 401));
  }

  // Check if the password matches
  const isPasswordMatched = await bcrypt.compare(password, user.password);

  if (!isPasswordMatched) {
    return next(new ErrorHandler("Invalid email or password", 401));
  }

  // Generate token
  const token = generateToken(user);

  // Set token in cookie
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
const getMyProfile = asyncHandler(async (req, res, next) => {
  const user = await userModel.findById(req.user);
  if (!user) {
    throw new ErrorHandler("User not found", 404);
  }
  return res.status(200).json({
    _id: user._id,
    username: user.userName,
    email: user.email,
    gender: user.gender,
    role: user.role,
    avatar: user.avatar.url,
    createdAt: user.createdAt,
  });
});

const forgetPassword = asyncHandler(async (req, res, next) => {
  const { email } = req.body;

  if (!email) {
    return next(new ErrorHandler("Email is required", 400));
  }

  const user = await userModel.findOne({ email });

  if (!user) {
    return next(new ErrorHandler("User does not exist", 400));
  }

  const resetToken = user.getResetToken();
  await user.save({ validateBeforeSave: false });

  const resetUrl = `${process.env.FRONTEND_URL}/resetpassword/${resetToken}`;
  const message = `Click on the link to reset your password: ${resetUrl}. If you did not request this, please ignore this email.`;

  try {
    await sendEmail({
      email: user.email,
      subject: "Vertex Reset Password",
      message,
    });

    res.status(200).json({
      success: true,
      message: `Reset token has been sent to ${user.email}`,
    });
  } catch (error) {
    console.error("Error in forgetPassword controller:", error.message);
    user.resetPasswordToken = undefined;
    user.resetPasswordExpire = undefined;

    await user.save({ validateBeforeSave: false });

    return next(new ErrorHandler("Email could not be sent", 500));
  }
});

const resetPassword = asyncHandler(async (req, res, next) => {
  const resetPasswordToken = crypto
    .createHash("sha256")
    .update(req.params.token)
    .digest("hex");
  const user = await userModel.findOne({
    resetPasswordToken,
    resetPasswordExpire: { $gt: Date.now() },
  });

  if (!user) {
    return next(
      new ErrorHandler(
        "Password reset token is invalid or has been expired",
        400
      )
    );
  }

  if (req.body.password !== req.body.confirmPassword) {
    return next(new ErrorHandler("Password does not match", 400));
  }
  const hashedPassword = await bcrypt.hash(req.body.password, 10);
  user.password = hashedPassword;
  user.resetPasswordToken = undefined;
  user.resetPasswordExpire = undefined;
  await user.save();
  res.status(200).json({
    success: true,
    message: "Password reset successful",
  });
});

export {
  registerUser,
  loginUser,
  logoutUser,
  getMyProfile,
  forgetPassword,
  resetPassword,
};
