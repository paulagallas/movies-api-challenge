import { Router } from "express";
import asyncHandler from "../middlewares/async-handler.js";
import { makeSearchMoviesController } from "../controllers/movie-controller.js";

import { makeMoviesService } from "../../businessLogic/services/movie-service.js";
import { makeTmdbClient } from "../../infra/tmdb-client.js";
import * as movieRepository from "../../dataAccess/repositories/movie-repository.js";

import * as userRepository from "../../dataAccess/repositories/user-repository.js";
import * as sessionRepository from "../../dataAccess/repositories/session-repository.js";
import { makeAuthService } from "../../businessLogic/services/auth-service.js";
import { makeRequireAuth } from "../middlewares/auth-middleware.js";

const router = Router();

// auth para proteger endpoint
const authService = makeAuthService({ userRepository, sessionRepository });
const requireAuth = makeRequireAuth({ authService });

// tmdb client
let tmdbClient;
try { tmdbClient = makeTmdbClient({ apiKey: process.env.TMDB_API_KEY }); } catch { }

const moviesService = makeMoviesService({ tmdbClient, movieRepository });

router.get("/", requireAuth, asyncHandler(makeSearchMoviesController({ moviesService })));

export default router;
