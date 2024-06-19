import asyncHandler from "../middleware/asyncHandler.js";
import projectModel from "../model/projectModel.js";
import ErrorHandler from "../utils/errorHandler.js";
import getDataUri from "../utils/dataUri.js";
import cloudinary from "cloudinary";
// Create Project
const createProject = asyncHandler(async (req, res, next) => {
  const file = req.file;
  const { title, description, location, price, bedrooms, bathrooms, area } =
    req.body;
  const fileUri = getDataUri(file);
  const myCloud = await cloudinary.v2.uploader.upload(fileUri.content, {
    folder: "ethupia",
  });
  const project = await projectModel.create({
    title,
    description,
    location,
    price,
    bedrooms,
    bathrooms,
    area,
    image: {
      public_id: myCloud.public_id,
      url: myCloud.secure_url,
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
const updateProjectImage = asyncHandler(async (req, res, next) => {
  const file = req.file;
  if (!file) return next(new ErrorHandler("Please upload an image", 400));
  const id = req.params.id;
  const project = await projectModel.findById(id);
  if (!project) return next(new ErrorHandler("Project not found", 404));
  project.image = await cloudinary.v2.uploader.destroy(project.image.public_id);
  const fileUri = getDataUri(file);
  const myCloud = await cloudinary.v2.uploader.upload(fileUri.content, {
    folder: "ethupia",
  });
  project.image = {
    public_id: myCloud.public_id,
    url: myCloud.secure_url,
  };
  await project.save();
  return res.status(200).json({
    success: true,
    message: "Project Image Updated Successfully",
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
  updateProjectImage,
};
