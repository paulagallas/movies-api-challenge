export default function errorHandler(err, _req, res, _next) {
    const status = err.status || 500;
    const body = { error: err.message || "Unexpected error" };
    if (err.code) body.code = err.code;
    res.status(status).json(body);
}
