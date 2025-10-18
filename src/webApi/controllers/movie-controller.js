export const makeSearchMoviesController = ({ moviesService }) => async (req, res) => {
    const { query } = req.query;
    const result = await moviesService.search({ query });
    res.json(result);
};
