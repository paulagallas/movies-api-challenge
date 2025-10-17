import { Router } from "express";
import { asyncHandler } from "../middlewares/error-handler.js";
import { loginController } from "../controllers/auth-controller.js";

const router = Router();

router.post("/login", asyncHandler(loginController));

export default router;
