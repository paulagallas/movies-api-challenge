import * as favoriteRepo from "../../dataAccess/repositories/favorite-repository.js";
import { Favorite } from "../domain/favorite.js";
import { BadRequestError } from "../errors/app-errors.js";

export function makeFavoriteService({ tmdbClient }) {
    const toMovieDto = (m) => ({
        id: m.id,
        title: m.title,
        overview: m.overview,
        releaseDate: m.release_date,
        poster: m.poster_path ? `https://image.tmdb.org/t/p/w500${m.poster_path}` : null
    });

    async function add(userId, movieId) {
        if (!userId || !movieId) {
            throw new BadRequestError("User ID and movie ID are required");
        }
        const existing = await favoriteRepo.listByUser(userId);
        if (existing.some(f => f.movieId === String(movieId))) {
            throw new ConflictError("Movie already in favorites");
        }
        //verificar que exista en tmdb
        const fav = new Favorite({ userId, movieId });
        await favoriteRepo.add(fav);
        return fav.toRecord();
    }

    async function remove(userId, movieId) {
        if (!userId || !movieId) {
            throw new BadRequestError("User ID and movie ID are required");
        }
        if (!(await favoriteRepo.exists(userId, movieId))) {
            throw new NotFoundError("Favorite not found");
        }
        await favoriteRepo.remove(userId, movieId);
    }

    async function list(userId) {
        const favs = await favoriteRepo.listByUser(userId);
        if (!favs.length) return [];
        const movies = await Promise.all(favs.map(f => tmdbClient.getMovieById(f.movieId)));
        return movies.map((m, i) => ({ ...toMovieDto(m), addedAt: favs[i].addedAt }));
    }

    return { add, remove, list };
}
