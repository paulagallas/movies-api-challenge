import express from "express";
import dotenv from "dotenv";
import userRoutes from "./webApi/routes/user-routes.js";
import authRoutes from "./webApi/routes/auth-routes.js";
import errorHandler from "./webApi/middlewares/error-handler.js";

dotenv.config();

const app = express();
app.use(express.json());

app.get("/", (_req, res) => res.send("¡API funcionando!"));

// rutas
app.use("/api/users", userRoutes);
app.use("/api/auth", authRoutes);

app.use((req, res) => res.status(404).json({ error: "Not found" }));

// error handler al final
app.use(errorHandler);

const port = process.env.PORT || 3000;
app.listen(port, () => console.log(`Servidor en http://localhost:${port}`));
