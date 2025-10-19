import { BadRequestError, NotFoundError } from "../errors/app-errors.js";
export function makeMoviesService({ tmdbClient, movieRepository }) {
    const toDto = (m) => ({
        id: m.id,
        title: m.title,
        overview: m.overview,
        releaseDate: m.release_date,
        poster: m.poster_path
            ? `https://image.tmdb.org/t/p/w500${m.poster_path}`
            : null,
    });

    async function fromTmdb(query) {
        const data = query
            ? await tmdbClient.searchMovies(query)
            : await tmdbClient.popular();

        const results = data?.results ?? [];
        const mapped = results.map(m => addSuggestionScore(toDto(m)));
        mapped.sort((a, b) => b.suggestionForTodayScore - a.suggestionForTodayScore);
        return mapped;
    }

    async function fromLocal(query) {
        const movies = typeof movieRepository?.getAll === "function"
            ? await movieRepository.getAll()
            : [];

        const q = query?.trim().toLowerCase() || "";
        const filtered = q
            ? movies.filter(m => m.title?.toLowerCase().includes(q))
            : movies;

        const scored = filtered.map(addSuggestionScore);
        scored.sort((a, b) => b.suggestionForTodayScore - a.suggestionForTodayScore);
        return scored;
    }

    return {
        async search({ query }) {
            if (query !== undefined && typeof query !== "string") {
                throw new BadRequestError("Query must be a string");
            }
            return await fromTmdb(query?.trim() || "");
        },

        async getById(id) {
            if (!id) throw new BadRequestError("Movie ID is required");
            const movie = await tmdbClient.getMovieById(id);
            if (!movie || !movie.id) throw new NotFoundError("Movie not found");
            return addSuggestionScore(toDto(movie));
        },
    };
}

function addSuggestionScore(movie) {
    return {
        ...movie,
        suggestionForTodayScore: Math.floor(Math.random() * 100),
    };
}
