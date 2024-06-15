import express from "express";
import {
  createProject,
  deleteProject,
  getAllProjects,
  getProjectById,
  updateProject,
} from "../controller/projectController.js";
import fileUpload from "../middleware/multer.js";
const router = express.Router();

router.route("/create").post(fileUpload, createProject);
router.route("/all").get(getAllProjects);
router
  .route("/:id")
  .get(getProjectById)
  .put(updateProject)
  .delete(deleteProject);
export default router;
