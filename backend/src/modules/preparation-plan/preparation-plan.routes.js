import { Router } from "express";

import {
  generatePreparationPlanController,
  getPreparationPlanController,
} from "./preparation-plan.controller.js";

import { authenticate } from "../../middleware/auth.middleware.js";

const preparationPlanRoutes = Router();

preparationPlanRoutes.post(
  "/:analysisId",
  authenticate,
  generatePreparationPlanController,
);

preparationPlanRoutes.get(
  "/:analysisId",
  authenticate,
  getPreparationPlanController,
);

export default preparationPlanRoutes;
