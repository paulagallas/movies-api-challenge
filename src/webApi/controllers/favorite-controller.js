export const makeAddFavorite = ({ favoriteService, userRepository }) => async (req, res) => {
    const user = await userRepository.findByEmail(req.userEmail);
    if (!user) return res.status(404).json({ error: "Usuario no encontrado" });

    await favoriteService.add(user.id, req.params.id);
    res.status(201).json({ message: "Added to favorites", movieId: req.params.id });
};

export const makeRemoveFavorite = ({ favoriteService, userRepository }) => async (req, res) => {
    const user = await userRepository.findByEmail(req.userEmail);
    if (!user) return res.status(404).json({ error: "Usuario no encontrado" });

    await favoriteService.remove(user.id, req.params.id);
    res.json({ message: "Removed from favorites", movieId: req.params.id });
};

export const makeListFavorites = ({ favoriteService, userRepository }) => async (req, res) => {
    const user = await userRepository.findByEmail(req.userEmail);
    if (!user) return res.status(404).json({ error: "Usuario no encontrado" });

    const movies = await favoriteService.list(user.id);
    res.json(movies);
};
