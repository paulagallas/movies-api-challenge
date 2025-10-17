import crypto from "crypto";
import { AppError } from "../../webApi/middlewares/error-handler.js";

const newToken = () => crypto.randomUUID();

export const makeAuthService = ({ userRepository, sessionRepository }) => ({
    async loginService({ email, password }) {
        if (!email || !password) {
            throw new AppError(400, "Email y password son requeridos", "VALIDATION");
        }

        const user = await userRepository.findByEmail(email);
        if (!user) throw new AppError(404, "Usuario no registrado", "NOT_FOUND");
        if (user.password !== password) throw new AppError(401, "Credenciales inválidas", "BAD_CREDENTIALS");

        await sessionRepository.deleteSessionsByEmail(user.email);

        const token = newToken();
        await sessionRepository.saveSession({
            token,
            email: user.email,
            createdAt: new Date().toISOString()
        });

        return { token };
    },

    async validateBearer(authorizationHeader) {
        if (!authorizationHeader) return null;
        const token = authorizationHeader.replace(/^Bearer\s+/i, "");
        if (!token) return null;
        const sess = await sessionRepository.findByToken(token);
        return sess?.email || null;
    },
});
