import { readJson, writeJson } from "../file-repository.js";

const FILE = "users.txt";

export async function findByEmail(email) {
    const users = await readJson(FILE);
    return users.find(u => u.email?.toLowerCase() === email?.toLowerCase());
}

export async function create(user) {
    const users = await readJson(FILE);
    users.push(user);
    await writeJson(FILE, users);
    return user;
}
