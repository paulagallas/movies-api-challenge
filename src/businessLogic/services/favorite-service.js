import { Favorite } from "../domain/favorite.js";
import { BadRequestError, ConflictError, NotFoundError } from "../errors/app-errors.js";

export function makeFavoriteService({ favoriteRepository, tmdbClient }) {
    const toMovieDto = (m) => ({
        id: m.id,
        title: m.title,
        overview: m.overview,
        releaseDate: m.release_date,
        poster: m.poster_path ? `https://image.tmdb.org/t/p/w500${m.poster_path}` : null
    });

    async function add(userId, movieId) {
        if (!userId || !movieId) throw new BadRequestError("User ID and movie ID are required");
        try { await tmdbClient.getMovieById(movieId); } catch { throw new NotFoundError("Movie not found"); }
        if (await favoriteRepository.exists(userId, movieId)) throw new ConflictError("Movie already in favorites");
        const fav = new Favorite({ userId, movieId });
        await favoriteRepository.add(fav);
        return fav.toRecord();
    }

    async function remove(userId, movieId) {
        if (!userId || !movieId) throw new BadRequestError("User ID and movie ID are required");
        if (!(await favoriteRepository.exists(userId, movieId))) throw new NotFoundError("Favorite not found");
        await favoriteRepository.remove(userId, movieId);
    }

    async function list(userId) {
        const favs = await favoriteRepository.listByUser(userId);
        if (!favs.length) return [];
        const movies = await Promise.all(favs.map(f => tmdbClient.getMovieById(f.movieId)));
        return movies.map((m, i) => ({ ...toMovieDto(m), addedAt: favs[i].addedAt }));
    }

    return { add, remove, list };
}
