import { readJson } from "../file-repository.js";

const FILE = "peliculas.txt";

export async function getAll() {
    return readJson(FILE);
}
