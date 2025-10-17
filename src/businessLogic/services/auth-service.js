import crypto from "crypto";
import { findByEmail } from "../../dataAccess/repositories/user-repository.js";
import { saveSession, deleteSessionsByEmail, findByToken } from "../../dataAccess/repositories/session-repository.js";
import { AppError } from "../../webApi/middlewares/error-handler.js";

function newToken() {
    return crypto.randomUUID();
}

export async function loginService({ email, password }) {
    if (!email || !password) {
        throw new AppError(400, "Email y password son requeridos", "VALIDATION");
    }

    const user = await findByEmail(email);
    if (!user) throw new AppError(404, "Usuario no registrado", "NOT_FOUND");

    if (user.password !== password) {
        throw new AppError(401, "Credenciales inválidas", "BAD_CREDENTIALS");
    }

    await deleteSessionsByEmail(user.email);

    const token = newToken();
    await saveSession({
        token,
        email: user.email,
        createdAt: new Date().toISOString()
    });

    return { token };
}

export async function validateBearer(authorizationHeader) {
    if (!authorizationHeader) return null;
    const token = authorizationHeader.replace(/^Bearer\s+/i, "");
    if (!token) return null;
    const sess = await findByToken(token);
    return sess?.email || null;
}
