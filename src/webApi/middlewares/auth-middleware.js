export const makeRequireAuth = ({ authService }) => async (req, res, next) => {
    try {
        const h = req.header("Authorization") || "";
        const m = h.match(/^Bearer\s+(.+)$/i);
        if (!m) {
            return res
                .status(401)
                .json({ error: "Not authenticated", code: "UNAUTHENTICATED" });
        }

        const token = m[1];
        const email = await authService.validateBearer(token);
        if (!email) {
            return res
                .status(401)
                .json({ error: "Invalid token", code: "UNAUTHENTICATED" });
        }

        req.userEmail = email;
        req.token = token;

        next();
    } catch (err) {
        next(err);
    }
};
