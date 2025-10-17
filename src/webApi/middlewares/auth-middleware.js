import { validateBearer } from "../../businessLogic/services/auth-service.js";

export async function requireAuth(req, res, next) {
  try {
    const email = await validateBearer(req.header("Authorization"));
    if (!email) {
      return res.status(401).json({ error: "No autenticado", code: "UNAUTHENTICATED" });
    }
    req.userEmail = email;
    next();
  } catch (err) {
    next(err);
  }
}
