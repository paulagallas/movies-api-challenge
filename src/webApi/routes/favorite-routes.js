import { Router } from "express";
import asyncHandler from "../middlewares/async-handler.js";

import { makeAddFavorite, makeRemoveFavorite, makeListFavorites } from "../controllers/favorite-controller.js";
import { makeFavoriteService } from "../../businessLogic/services/favorite-service.js";
import { makeTmdbClient } from "../../infra/tmdb-client.js";

import * as userRepository from "../../dataAccess/repositories/user-repository.js";
import * as sessionRepository from "../../dataAccess/repositories/session-repository.js";
import * as favoriteRepository from "../../dataAccess/repositories/favorite-repository.js";

import { makeAuthService } from "../../businessLogic/services/auth-service.js";
import { makeUserService } from "../../businessLogic/services/user-service.js";
import { makeRequireAuth } from "../middlewares/auth-middleware.js";

const router = Router();

// auth
const authService = makeAuthService({ userRepository, sessionRepository });
const requireAuth = makeRequireAuth({ authService });

// services
const userService = makeUserService({ userRepository });
const tmdbClient = makeTmdbClient({ apiKey: process.env.TMDB_API_KEY });
const favoriteService = makeFavoriteService({ favoriteRepository, tmdbClient });

// protege todo el router
router.use(requireAuth);

// rutas
router.get("/", asyncHandler(makeListFavorites({ favoriteService, userService })));
router.post("/:movieId", asyncHandler(makeAddFavorite({ favoriteService, userService })));
router.delete("/:movieId", asyncHandler(makeRemoveFavorite({ favoriteService, userService })));

export default router;
