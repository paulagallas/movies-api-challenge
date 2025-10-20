import { Router } from "express";
import asyncHandler from "../middlewares/async-handler.js";
import { makeLoginController, makeLogoutController } from "../controllers/auth-controller.js";

import { makeAuthService } from "../../businessLogic/services/auth-service.js";
import * as userRepository from "../../dataAccess/repositories/user-repository.js";
import * as sessionRepository from "../../dataAccess/repositories/session-repository.js";
import { makeRequireAuth } from "../middlewares/auth-middleware.js";

const router = Router();

const authService = makeAuthService({ userRepository, sessionRepository });

// crear sesión (login)
const loginController = makeLoginController({ authService });
router.post("/", asyncHandler(loginController));

// cerrar sesión (logout)
const requireAuth = makeRequireAuth({ authService });
const logoutController = makeLogoutController({ authService });
router.delete("/", requireAuth, asyncHandler(logoutController));

export default router;
