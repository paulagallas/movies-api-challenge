import * as favoriteRepo from "../../dataAccess/repositories/favorite-repository.js";
import { Favorite } from "../domain/favorite.js";

export function makeFavoriteService({ tmdbClient }) {
    const toMovieDto = (m) => ({
        id: m.id,
        title: m.title,
        overview: m.overview,
        releaseDate: m.release_date,
        poster: m.poster_path ? `https://image.tmdb.org/t/p/w500${m.poster_path}` : null
    });

    async function add(userId, movieId) {
        const fav = new Favorite({ userId, movieId });
        await favoriteRepo.add(fav);
    }

    async function remove(userId, movieId) {
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
