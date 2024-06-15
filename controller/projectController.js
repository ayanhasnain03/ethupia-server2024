import asyncHandler from "../middleware/asyncHandler.js";
import projectModel from "../model/projectModel.js";
import ErrorHandler from "../utils/errorHandler.js";

// Create Project
const createProject = asyncHandler(async (req, res, next) => {
  const { title, description, location, price, bedrooms, bathrooms, area } =
    req.body;
  console.log(req.body);
  const project = await projectModel.create({
    title,
    description,
    location,
    price,
    bedrooms,
    bathrooms,
    area,
    image: {
      public_id: "req.file.filename",
      url: "req.file.path",
    },
  });
  return res.status(201).json({
    success: true,
    project,
  });
});

const getAllProjects = asyncHandler(async (req, res, next) => {
  const projects = await projectModel.find();
  if (projects.length === 0) {
    throw new ErrorHandler("Projects not found", 404);
  }
  return res.status(200).json({
    success: true,
    projects,
  });
});
const getProjectById = asyncHandler(async (req, res, next) => {
  const id = req.params.id;
  const project = await projectModel.findById(id);
  if (!project) {
    throw new ErrorHandler("Project not found", 404);
  }
  return res.status(200).json({
    success: true,
    project,
  });
});
const updateProject = asyncHandler(async (req, res, next) => {
  const { title, description, location, price, bedrooms, bathrooms, area } =
    req.body;

  const id = req.params.id;
  const project = await projectModel.findById(id);
  if (!project) return next(new ErrorHandler("Project not found", 404));
  if (title) project.title = title;
  if (description) project.description = description;
  if (location) project.location = location;
  if (price) project.price = price;
  if (bedrooms) project.bedrooms = bedrooms;
  if (bathrooms) project.bathrooms = bathrooms;
  if (area) project.area = area;
  await project.save();
  return res.status(200).json({
    success: true,
    message: "Project Updated Successfully",
  });
});
const deleteProject = asyncHandler(async (req, res, next) => {
  const project = req.params.id;
  if (!project) return next(new ErrorHandler("Project not found", 404));
  await projectModel.findByIdAndDelete(project);
  return res.status(200).json({
    success: true,
    message: "Project Deleted Successfully",
  });
});
export {
  createProject,
  getAllProjects,
  getProjectById,
  updateProject,
  deleteProject,
};
