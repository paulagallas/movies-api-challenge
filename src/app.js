import express from "express";
import dotenv from "dotenv";
import userRoutes from "./webApi/routes/user-routes.js";
import authRoutes from "./webApi/routes/auth-routes.js";
import errorHandler from "./webApi/middlewares/error-handler.js";

dotenv.config();

const app = express();
app.use(express.json());

app.use((err, _req, res, next) => {
    if (err instanceof SyntaxError && "body" in err) {
        return res.status(400).json({ error: "JSON inválido", code: "BAD_JSON" });
    }
    next(err);
});

// Ruta base
app.get("/", (_req, res) => res.send("¡API funcionando!"));

app.use("/api/users", userRoutes);
app.use("/api/auth", authRoutes);

app.use((_req, res) => res.status(404).json({ error: "Not found" }));

// Middleware global de errores
app.use(errorHandler);

// Iniciar servidor
const port = process.env.PORT || 3000;
app.listen(port, () => console.log(`Servidor en http://localhost:${port}`));
