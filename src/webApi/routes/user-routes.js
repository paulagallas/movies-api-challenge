import { Router } from "express";
import { asyncHandler } from "../middlewares/error-handler.js";
import { registerController } from "../controllers/user-controller.js";

const router = Router();

router.post("/register", asyncHandler(registerController));

export default router;
