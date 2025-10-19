import * as favoritesRepo from "../../dataAccess/repositories/favorite-repository.js";
export function makeMoviesService({ tmdbClient, movieRepository }) {
    const toDto = (m) => ({
        id: m.id,
        title: m.title,
        overview: m.overview,
        releaseDate: m.release_date,
        poster: m.poster_path ? `https://image.tmdb.org/t/p/w500${m.poster_path}` : null,
        suggestionForTodayScore: Math.floor(Math.random() * 100),
    });

    async function fromTmdb(query) {
        const data = query ? await tmdbClient.searchMovies(query) : await tmdbClient.popular();
        const mapped = (data?.results ?? []).map(toDto);
        mapped.sort((a, b) => b.suggestionForTodayScore - a.suggestionForTodayScore);
        return mapped;
    }

    async function fromLocal(query) {
        const local = typeof movieRepository?.getAll === "function" ? await movieRepository.getAll() : [];
        const base = query ? local.filter(x => x.title?.toLowerCase().includes(query.toLowerCase())) : local;
        const withScore = base.map(m => ({ ...m, suggestionForTodayScore: Math.floor(Math.random() * 100) }));
        withScore.sort((a, b) => b.suggestionForTodayScore - a.suggestionForTodayScore);
        return withScore;
    }

    return {
        async search({ query }) {
            try { return await fromTmdb(query); }
            catch { return await fromLocal(query); }
        },
        async getById(id) {
            return tmdbClient.getMovieById(id);
        }
    };
}

