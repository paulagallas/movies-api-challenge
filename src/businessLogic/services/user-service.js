import { User } from "../domain/user.js";
import { BadRequestError, ConflictError} from "../errors/app-errors.js";

export const makeUserService = ({ userRepository }) => ({
    async register(payload) {
        const { email, firstName, lastName, password } = payload ?? {};
        if (!email || !firstName || !lastName || !password) {
            throw new BadRequestError("All required fields must be provided");
        }
        const normEmail = String(email).trim().toLowerCase();
        if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(normEmail)) {
            throw new BadRequestError("Invalid email format");
        }
        const exists = await userRepository.findByEmail(email);
        if (exists) throw new ConflictError("Email is already registered");

        const user = new User({ email, firstName, lastName, password });
        await userRepository.create(user.toRecord());
        return user.toPublic();
    },

    async getByEmail(email) {
        if (!email) throw new BadRequestError("Email is required");
        return userRepository.findByEmail(email);
    },
});
