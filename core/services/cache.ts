import { Redis } from '@upstash/redis';

function createClient(): Redis | null {
  const url = process.env.REDIS_URL;
  const token = process.env.REDIS_TOKEN;
  if (!url || !token) return null;
  return new Redis({ url, token });
}

export const cache = createClient();

export function cacheAvailable(): boolean {
  return cache !== null;
}

export async function getOrSet<T>(key: string, fetch: () => Promise<T>, ttlSeconds = 300): Promise<T> {
  if (!cache) return fetch();
  const cached = await cache.get<T>(key);
  if (cached !== null) return cached;
  const value = await fetch();
  await cache.set(key, value, { ex: ttlSeconds });
  return value;
}
