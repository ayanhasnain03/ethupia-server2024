import express from "express";
import {
  createProject,
  deleteProject,
  getAllProjects,
  getProjectById,
  updateProject,
  updateProjectImage,
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
router.route("/image/:id").put(fileUpload, updateProjectImage);
export default router;
