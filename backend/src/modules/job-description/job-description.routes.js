import express from "express"
import { authenticate } from "../../middleware/auth.middleware.js";
import { createJobDescription, deleteJobDescriptions, getJobDescriptions } from "./job-description.controller.js";

const jobDescriptionRoutes = express.Router()

jobDescriptionRoutes.post( "/", authenticate, createJobDescription);
jobDescriptionRoutes.get( "/", authenticate, getJobDescriptions);
jobDescriptionRoutes.delete( "/:jobId", authenticate, deleteJobDescriptions);

export default jobDescriptionRoutes