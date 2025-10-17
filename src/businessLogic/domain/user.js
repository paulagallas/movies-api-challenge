import { AppError } from "../../webApi/middlewares/error-handler.js";
export class User {
    constructor({ id, email, firstName, lastName, password }) {
        if (!email || !firstName || !lastName || !password) {
            throw new AppError(400, "Faltan campos requeridos para crear el usuario", "VALIDATION");
        }

        this.id = id || Date.now().toString();
        this.email = email.toLowerCase().trim();
        this.firstName = firstName.trim();
        this.lastName = lastName.trim();
        this.password = password;
    }

    get fullName() {
        return `${this.firstName} ${this.lastName}`;
    }
    // Para responder al cliente
    toPublic() {
        const { password, ...safe } = this;
        return safe;
    }

    // Para persistir en archivo
    toRecord() {
        return {
            id: this.id,
            email: this.email,
            firstName: this.firstName,
            lastName: this.lastName,
            password: this.password
        };
    }
}
