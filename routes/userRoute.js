import express from "express";
import {
  forgetPassword,
  getMyProfile,
  loginUser,
  logoutUser,
  registerUser,
  resetPassword,
} from "../controller/userController.js";
import fileUpload from "../middleware/multer.js";
import { isAuthenticatedUser } from "../middleware/auth.js";

const router = express.Router();
router.route("/create").post(fileUpload, registerUser);
router.route("/login").post(loginUser);
router.route("/logout").post(isAuthenticatedUser, logoutUser);
router.route("/profile").get(isAuthenticatedUser, getMyProfile);
router.route("/forgetpassword").post(forgetPassword);
router.route("/resetpassword/:token").put(resetPassword);
export default router;
