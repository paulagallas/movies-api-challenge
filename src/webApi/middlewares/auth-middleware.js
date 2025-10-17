export const makeRequireAuth = ({ authService }) => async (req, res, next) => {
    try {
        const h = req.header("Authorization") || "";
        const m = h.match(/^Bearer\s+(.+)$/i);
        if (!m) return res.status(401).json({ error: "No autenticado", code: "UNAUTHENTICATED" });
        const email = await authService.validateBearer(m[1]);
        if (!email) return res.status(401).json({ error: "Token inválido", code: "UNAUTHENTICATED" });
        req.userEmail = email;
        next();
    } catch (err) { next(err); }
};
