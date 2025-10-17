import { register } from "../../businessLogic/services/user-service.js";

export async function registerController(req, res) {
    const user = await register(req.body);
    res.status(201).json(user);
}
