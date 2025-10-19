// webApi/routes/favorite-routes.js
import { Router } from "express";
import asyncHandler from "../middlewares/async-handler.js";

import { makeAddFavorite, makeRemoveFavorite, makeListFavorites } from "../controllers/favorite-controller.js";
import { makeFavoriteService } from "../../businessLogic/services/favorite-service.js";
import { makeTmdbClient } from "../../infra/tmdb-client.js";

import * as userRepository from "../../dataAccess/repositories/user-repository.js";
import * as sessionRepository from "../../dataAccess/repositories/session-repository.js";
import { makeAuthService } from "../../businessLogic/services/auth-service.js";
import { makeRequireAuth } from "../middlewares/auth-middleware.js";

const router = Router();

// auth
const authService = makeAuthService({ userRepository, sessionRepository });
const requireAuth = makeRequireAuth({ authService });

// deps service
const tmdbClient = makeTmdbClient({ apiKey: process.env.TMDB_API_KEY });
const favoriteService = makeFavoriteService({ tmdbClient });

// proteger todo el router
router.use(requireAuth);

// listar favoritos del usuario actual
router.get("/", asyncHandler(makeListFavorites({ favoriteService, userRepository })));

// agregar favorito
router.post("/:id", asyncHandler(makeAddFavorite({ favoriteService, userRepository })));

// eliminar favorito
router.delete("/:id", asyncHandler(makeRemoveFavorite({ favoriteService, userRepository })));

export default router;
