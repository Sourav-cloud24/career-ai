
import { Router } from "express";
import { createAnalysisController, deleteAnalysis, getAnalysesController, getAnalysisByIdController } from "./analysis.controller.js";
import { authenticate } from "../../middleware/auth.middleware.js";
// Import your existing authentication middleware here.

const analysesRoutes = Router();

analysesRoutes.post("/", authenticate, createAnalysisController);

analysesRoutes.get("/:analysisId", authenticate, getAnalysisByIdController);

analysesRoutes.get("/", authenticate, getAnalysesController);

analysesRoutes.delete("/:analysisId", authenticate, deleteAnalysis);

export default analysesRoutes;