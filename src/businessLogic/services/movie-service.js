export function makeMoviesService({ tmdbClient, movieRepository }) {
    return {
        async search({ query }) {
            try {
                const data = query ? await tmdbClient.searchMovies(query)
                    : await tmdbClient.popular();
                return (data.results || []).map(m => ({
                    id: m.id,
                    title: m.title,
                    overview: m.overview,
                    releaseDate: m.release_date,
                    poster: m.poster_path ? `https://image.tmdb.org/t/p/w500${m.poster_path}` : null
                }));
            } catch {
                const local = await movieRepository.getAll();
                if (!query) return local;
                const q = query.toLowerCase();
                return local.filter(x => x.title?.toLowerCase().includes(q));
            }
        }
    };
}
