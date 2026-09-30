import { Router } from "express";
import { register, login, refresh, logout } from "./auth.controller.js";
import { authenticate } from "../../middleware/auth.middleware.js";
import { getCurrentUser } from "./user.controller.js";

const authRoutes = Router();

authRoutes.post("/register", register);
authRoutes.post("/login", login);
// authRoutes.post("/login", login);
authRoutes.post("/logout", logout);
authRoutes.get("/me", authenticate, getCurrentUser);
authRoutes.post("/refresh", refresh);

export default authRoutes;