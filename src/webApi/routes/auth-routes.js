import { Router } from "express";
import { asyncHandler } from "../middlewares/error-handler.js";
import { makeLoginController } from "../controllers/auth-controller.js";

import { makeAuthService } from "../../businessLogic/services/auth-service.js";
import * as userRepository from "../../dataAccess/repositories/user-repository.js";
import * as sessionRepository from "../../dataAccess/repositories/session-repository.js";

const router = Router();

const authService = makeAuthService({ userRepository, sessionRepository });
const loginController = makeLoginController({ authService });

router.post("/login", asyncHandler(loginController));

export default router;
