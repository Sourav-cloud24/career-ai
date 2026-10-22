
import { Router } from "express";
import { createAnalysisController, getAnalysesController, getAnalysisByIdController } from "./analysis.controller.js";
import { authenticate } from "../../middleware/auth.middleware.js";
// Import your existing authentication middleware here.

const analysesRoutes = Router();

analysesRoutes.post("/", authenticate, createAnalysisController);

analysesRoutes.get("/:analysisId", authenticate, getAnalysisByIdController);

analysesRoutes.get("/", authenticate, getAnalysesController);

export default analysesRoutes;