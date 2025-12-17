import { promises as fs } from "fs";
import path from "path";

const CACHE_ROOT = path.join(process.cwd(), ".cache", "acs");

async function ensureCacheDir() {
  await fs.mkdir(CACHE_ROOT, { recursive: true });
}

export async function writeCache<T>(key: string, payload: T) {
  try {
    await ensureCacheDir();
    const filePath = path.join(CACHE_ROOT, `${key}.json`);
    await fs.writeFile(filePath, JSON.stringify(payload, null, 2), "utf8");
  } catch (error) {
    if (process.env.NODE_ENV === "development") {
      console.warn(`[ACS][cache] Failed to persist cache for ${key}`, error);
    }
  }
}

export async function readCache<T>(key: string): Promise<T | null> {
  try {
    const filePath = path.join(CACHE_ROOT, `${key}.json`);
    const data = await fs.readFile(filePath, "utf8");
    return JSON.parse(data) as T;
  } catch {
    return null;
  }
}
