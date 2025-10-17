import { readJson, writeJson } from "../file-repository.js";

const FILE = "sessions.txt";

export async function getAllSessions() {
    return await readJson(FILE);
}

export async function saveSession(session) {
    const all = await getAllSessions();
    all.push(session);
    await writeJson(FILE, all);
}

export async function deleteSessionsByEmail(email) {
    const all = await getAllSessions();
    const filtered = all.filter(s => s.email !== email);
    await writeJson(FILE, filtered);
}

export async function findByToken(token) {
    const all = await getAllSessions();
    return all.find(s => s.token === token) || null;
}
