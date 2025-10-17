export class AppError extends Error {
    constructor(status, message, code) {
        super(message);
        this.status = status;
        this.code = code;
    }
}

export const asyncHandler = (fn) => (req, res, next) =>
    Promise.resolve(fn(req, res, next)).catch(next);

export default function errorHandler(err, _req, res, _next) {
    const status = err.status || 500;
    const body = { error: err.message || "Error inesperado" };
    if (err.code) body.code = err.code;
    res.status(status).json(body);
}
