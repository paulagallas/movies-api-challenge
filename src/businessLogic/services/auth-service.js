import crypto from "crypto";
import { BadRequestError, UnauthorizedError, NotFoundError } from "../errors/app-errors.js";

const newToken = () => crypto.randomUUID();

export const makeAuthService = ({ userRepository, sessionRepository }) => ({
    async loginService({ email, password }) {
        if (!email || !password) {
            throw new BadRequestError("All required fields must be provided");
        }

        const user = await userRepository.findByEmail(String(email).trim().toLowerCase());
        if (!user) throw new NotFoundError("No user found with the provided email");
        if (user.password !== password) throw new UnauthorizedError("Invalid credentials");

        await sessionRepository.deleteSessionsByEmail(user.email);

        const token = newToken();
        await sessionRepository.saveSession({
            token,
            email: user.email,
            createdAt: new Date().toISOString()
        });

        return { token };
    },

    async validateBearer(tokenOrHeader) {
        if (!tokenOrHeader) return null;

        const token = tokenOrHeader.startsWith("Bearer ")
            ? tokenOrHeader.replace(/^Bearer\s+/i, "")
            : tokenOrHeader;

        if (!token) return null;

        const sess = await sessionRepository.findByToken(token);
        return sess?.email || null;
    },

    async logout(token) {
        if (!token) throw new BadRequestError("Missing token");

        const removed = await sessionRepository.removeByToken(token);
        if (!removed) throw new UnauthorizedError("Invalid session");
    }
});
