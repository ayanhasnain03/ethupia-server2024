import express from "express";
import { registerUser } from "../controller/userController.js";
import fileUpload from "../middleware/multer.js";
const router = express.Router();
router.route("/create").post(fileUpload, registerUser);
export default router;
