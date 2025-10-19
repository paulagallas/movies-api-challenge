import { BadRequestError } from "../errors/app-errors";

export class Favorite {
    constructor({ userId, movieId, addedAt }) {
        if (!userId) throw new Error("userId is required");
        if (movieId === undefined || movieId === null) throw new BadRequestError("movieId is required");

        this.userId = String(userId);
        this.movieId = String(movieId);
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
