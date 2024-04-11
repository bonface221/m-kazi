import { redis } from "..";

export async function checkIfSessionExists(sessionId: string) {
  return await redis.exists(sessionId);
}

export async function getSessionAsJson(sessionId: string) {
  let value = await redis.get(sessionId);
  if (!value) return null;
  return JSON.parse(value);
}
