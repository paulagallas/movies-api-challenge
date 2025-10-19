export class AppError extends Error {
    constructor(status, message, code) {
        super(message);
        this.status = status;
        this.code = code;
    }
}

export class BadRequestError extends AppError {
    constructor(message = "Bad request") {
        super(400, message, "BAD_REQUEST");
    }
}

export class UnauthorizedError extends AppError {
    constructor(message = "Unauthorized") {
        super(401, message, "UNAUTHORIZED");
    }
}

export class NotFoundError extends AppError {
    constructor(message = "Not found") {
        super(404, message, "NOT_FOUND");
    }
}

export class ConflictError extends AppError {
    constructor(message = "Conflict") {
        super(409, message, "CONFLICT");
    }
}

