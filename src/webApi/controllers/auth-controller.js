import { loginService } from "../../businessLogic/services/auth-service.js";

export async function loginController(req, res) {
    const result = await loginService(req.body);
    res.status(200).json(result);
}
