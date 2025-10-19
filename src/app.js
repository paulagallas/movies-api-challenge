
import "dotenv/config";
import express from "express";

import userRoutes from "./webApi/routes/user-routes.js";
import favoriteRoutes from "./webApi/routes/favorite-routes.js";
import authRoutes from "./webApi/routes/auth-routes.js";
import moviesRoutes from "./webApi/routes/movie-routes.js";
import errorHandler from "./webApi/middlewares/error-handler.js";

const app = express();
app.use(express.json());

// JSON inválido
app.use((err, _req, res, next) => {
    if (err instanceof SyntaxError && "body" in err) {
        return res.status(400).json({ error: "JSON inválido", code: "BAD_JSON" });
    }
    next(err);
});

// Ruta base
app.get("/", (_req, res) => res.send("¡API funcionando!"));

// Rutas
app.use("/api/users", userRoutes);
app.use("/api/auth", authRoutes);
app.use("/api/movies", moviesRoutes);
app.use("/api/favorites", favoriteRoutes);

// 404
app.use((_req, res) => res.status(404).json({ error: "Not found" }));

// Errores
app.use(errorHandler);

//
const port = process.env.PORT || 3000;
app.listen(port, () => {
    console.log(`Servidor iniciado en http://localhost:${port}`);
});
