import { Router } from "express";
import asyncHandler from "../middlewares/async-handler.js";
import { makeRegisterController } from "../controllers/user-controller.js";

import { makeUserService } from "../../businessLogic/services/user-service.js";
import * as userRepository from "../../dataAccess/repositories/user-repository.js";

const router = Router();

const userService = makeUserService({ userRepository });

const registerController = makeRegisterController({ userService });

router.post("/", asyncHandler(registerController));

export default router;
