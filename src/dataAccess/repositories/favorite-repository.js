import { readJson, writeJson } from "../file-repository.js";
const FILE = "favorites.txt";

export async function listByUser(userId) {
    const data = await readJson(FILE);
    return data
        .filter(f => f.userId === String(userId))
        .sort((a, b) => (b.addedAt ?? "").localeCompare(a.addedAt ?? ""));
}

export async function add(favorite) {
    const data = await readJson(FILE);
    const rec = favorite.toRecord();
    const exists = data.some(f => f.userId === rec.userId && f.movieId === rec.movieId);
    if (!exists) {
        data.push(rec);
        await writeJson(FILE, data);
    }
}

export async function remove(userId, movieId) {
    const uid = String(userId);
    const mid = String(movieId);
    const data = await readJson(FILE);
    const updated = data.filter(f => !(f.userId === uid && f.movieId === mid));
    await writeJson(FILE, updated);
}

export async function exists(userId, movieId) {
    const data = await readJson(FILE);
    const uid = String(userId);
    const mid = String(movieId);
    return data.some(f => f.userId === uid && f.movieId === mid);
}

