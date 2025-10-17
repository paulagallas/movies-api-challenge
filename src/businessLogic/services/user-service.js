import { User } from "../domain/user.js";
import { AppError } from "../../webApi/middlewares/error-handler.js";

export const makeUserService = ({ userRepository }) => ({
    async register(payload) {
        const { email, firstName, lastName, password } = payload ?? {};
        if (!email || !firstName || !lastName || !password) {
            throw new AppError(400, "Faltan campos requeridos", "VALIDATION");
        }

        const exists = await userRepository.findByEmail(email);
        if (exists) throw new AppError(409, "Email ya registrado", "USER_EXISTS");

        const user = new User({ email, firstName, lastName, password });
        await userRepository.create(user.toRecord());
        return user.toPublic();
    },
});
