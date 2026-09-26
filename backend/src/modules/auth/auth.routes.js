import { Router } from "express";
import { register, login, refresh } from "./auth.controller.js";
import { authenticate } from "../../middleware/auth.middleware.js";
import { getCurrentUser } from "./user.controller.js";

const authRoutes = Router();

authRoutes.post("/register", register);
authRoutes.post("/login", login);
authRoutes.post("/refresh", refresh);
authRoutes.get("/me", authenticate, getCurrentUser);

export default authRoutes;