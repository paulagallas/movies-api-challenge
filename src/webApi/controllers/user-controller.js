export const makeRegisterController = ({ userService }) =>
    async (req, res) => {
        const user = await userService.register(req.body);
        res.status(201).json(user);
    };
