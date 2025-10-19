import "dotenv/config";
import express from "express";

import userRoutes from "./webApi/routes/user-routes.js";
import favoriteRoutes from "./webApi/routes/favorite-routes.js";
import authRoutes from "./webApi/routes/auth-routes.js";
import moviesRoutes from "./webApi/routes/movie-routes.js";
import errorHandler from "./webApi/middlewares/error-handler.js";

const app = express();
app.use(express.json());

// Invalid JSON (body parser) - must be before routes and have 4 args
app.use((err, _req, res, next) => {
    // Narrow the check so we only catch JSON parse errors
    if (err instanceof SyntaxError && err.status === 400 && "body" in err) {
        return res.status(400).json({ error: "Invalid JSON", code: "BAD_JSON" });
    }
    next(err);
});

// Base route
app.get("/", (_req, res) => res.send("API is running!"));

// Routes
app.use("/api/users", userRoutes);
app.use("/api/auth", authRoutes);
app.use("/api/movies", moviesRoutes);
app.use("/api/favorites", favoriteRoutes);

// 404 - keep before error handler
app.use((_req, res) => res.status(404).json({ error: "Not found", code: "NOT_FOUND" }));

app.use(errorHandler);

// Start server
const port = process.env.PORT || 3000;
app.listen(port, () => {
    console.log(`Server listening at http://localhost:${port}`);
});

export default app;
