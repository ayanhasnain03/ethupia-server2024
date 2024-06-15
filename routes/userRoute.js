import express from "express";
import { loginUser, registerUser } from "../controller/userController.js";
import fileUpload from "../middleware/multer.js";
const router = express.Router();
router.route("/create").post(fileUpload, registerUser);
router.route("/login").post(loginUser);
export default router;
