export const makeLoginController = ({ authService }) =>
    async (req, res) => {
        const result = await authService.loginService(req.body);
        res.status(200).json(result);
    };
