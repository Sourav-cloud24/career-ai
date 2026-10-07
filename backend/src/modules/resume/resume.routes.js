import express from "express"
import upload from "../../config/multer.js"
import { deleteResume, getResumes, uploadResume } from "./resume.controller.js";
import { authenticate } from "../../middleware/auth.middleware.js";

const resumeRoutes = express.Router()

resumeRoutes.post( "/", authenticate, upload.single("resume"), uploadResume);
resumeRoutes.get( "/", authenticate, getResumes);
resumeRoutes.delete( "/:resumeId", authenticate, deleteResume);

export default resumeRoutes