import { promises as fs } from "fs";
import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const full = (f) => path.resolve(__dirname, "..", "..", "data", f);

export async function readJson(file) {
    try {
        const raw = await fs.readFile(full(file), "utf8");
        return JSON.parse(raw || "[]");
    } catch (e) {
        if (e.code === "ENOENT") return [];
        throw e;
    }
}

export async function writeJson(file, data) {
    await fs.writeFile(full(file), JSON.stringify(data, null, 2));
}

