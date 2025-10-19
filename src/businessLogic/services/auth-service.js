import crypto from "crypto";
import { BadRequestError, UnauthorizedError, NotFoundError } from "../errors/app-errors";


const newToken = () => crypto.randomUUID();

export const makeAuthService = ({ userRepository, sessionRepository }) => ({
    async loginService({ email, password }) {
        if (!email || !password) {
            throw new BadRequestError("All required fields must be provided");
        }

        const user = await userRepository.findByEmail(email);
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

    async validateBearer(authorizationHeader) {
        if (!authorizationHeader) return null;
        const token = authorizationHeader.replace(/^Bearer\s+/i, "");
        if (!token) return null;
        const sess = await sessionRepository.findByToken(token);
        return sess?.email || null;
    },
});
