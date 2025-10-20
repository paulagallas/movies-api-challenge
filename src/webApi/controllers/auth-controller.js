export const makeLoginController = ({ authService }) =>
    async (req, res) => {
        const result = await authService.loginService(req.body);
        res.status(200).json(result);
    };

export const makeLogoutController = ({ authService }) => async (req, res) => {
    await authService.logout(req.token);
    res.status(204).end();
};
