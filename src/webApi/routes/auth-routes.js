import { Router } from "express";
import asyncHandler from "../middlewares/async-handler.js";
import { makeLoginController } from "../controllers/auth-controller.js";

import { makeAuthService } from "../../businessLogic/services/auth-service.js";
import * as userRepository from "../../dataAccess/repositories/user-repository.js";
import * as sessionRepository from "../../dataAccess/repositories/session-repository.js";

const router = Router();

const authService = makeAuthService({ userRepository, sessionRepository });

const loginController = makeLoginController({ authService });
//const logoutController = makeLogoutController({ authService });

// crear sesi�n
router.post("/", asyncHandler(loginController));

// cerrar sesi�n
//router.delete("/", asyncHandler(logoutController));

export default router;
