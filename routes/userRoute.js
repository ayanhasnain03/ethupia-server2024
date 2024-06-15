import express from "express";
import {
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
export default router;
