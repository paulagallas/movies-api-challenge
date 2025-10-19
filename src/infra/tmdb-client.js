import { BadRequestError } from "../businessLogic/errors/app-errors.js";


const BASE = "https://api.themoviedb.org/3";

export function makeTmdbClient({ apiKey, language = "es-ES" }) {
    if (!apiKey) throw new Error("TMDB_API_KEY missing");

    const call = async (path, params = {}) => {
        const qs = new URLSearchParams({ api_key: apiKey, language, ...params });
        const r = await fetch(`${BASE}${path}?${qs.toString()}`);
        if (!r.ok) throw new Error(`TMDB error ${r.status}`);
        return r.json();
    };

    return {
        async searchMovies(query) {
            if (!query || !query.trim()) return { results: [] };
            return call("/search/movie", { query });
        },

        async popular() {
            return call("/movie/popular");
        },

        async getMovieById(id) {
            if (!id) throw new BadRequestError("Movie ID is required");
            return call(`/movie/${id}`);
        }
    };
}
  