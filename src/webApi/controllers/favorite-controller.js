import { NotFoundError } from "../../businessLogic/errors/app-errors.js";

export const makeAddFavorite = ({ favoriteService, userService }) => async (req, res) => {
    const user = await userService.getByEmail(req.userEmail);
    if (!user) throw new NotFoundError("User not found");

    const favorite = await favoriteService.add(user.id, req.body.movieId);

    res.status(201).json(favorite);
};

export const makeRemoveFavorite = ({ favoriteService, userService }) => async (req, res) => {
    const user = await userService.getByEmail(req.userEmail);
    if (!user) throw new NotFoundError("User not found");

    await favoriteService.remove(user.id, req.params.id);
    res.status(204).end();
};

export const makeListFavorites = ({ favoriteService, userService }) => async (req, res) => {
    const user = await userService.getByEmail(req.userEmail);
    if (!user) throw new NotFoundError("User not found");

    const movies = await favoriteService.list(user.id);
    res.status(200).json(movies);
};
