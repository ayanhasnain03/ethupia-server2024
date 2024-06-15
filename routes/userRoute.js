import express from "express";
import {
  getMyProfile,
  loginUser,
  logoutUser,
  registerUser,
} from "../controller/userController.js";
import fileUpload from "../middleware/multer.js";
import { isAuthenticated } from "../middleware/auth.js";

const router = express.Router();
router.route("/create").post(registerUser, fileUpload);
router.route("/login").post(loginUser);
router.route("/logout").post(isAuthenticated, logoutUser);
router.route("/profile").get(isAuthenticated, getMyProfile);
export default router;
