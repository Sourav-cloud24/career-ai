
import { Router } from "express";

import { getDashboardOverviewController } from "./dashboard.controller.js";
import { authenticate } from "../../middleware/auth.middleware.js";

const dashboardRouter = Router();

dashboardRouter.get("/overview", authenticate, getDashboardOverviewController);

export default dashboardRouter;
