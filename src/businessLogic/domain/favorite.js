
export class Favorite {
    constructor({ userId, movieId, addedAt }) {
        if (!userId) throw new Error("userId is required");
        if (movieId === undefined || movieId === null) throw new Error("movieId is required");

        this.userId = String(userId);
        this.movieId = String(movieId); // normalizamos a string
        this.addedAt = addedAt ? new Date(addedAt).toISOString() : new Date().toISOString();
    }

    toRecord() {
        return {
            userId: this.userId,
            movieId: this.movieId,
            addedAt: this.addedAt
        };
    }
}
