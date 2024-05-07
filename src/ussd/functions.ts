import { redis } from "..";

const createOrderUrl =
  process.env.SERVER_URL || "http://localhost:3001/api/create-order";

export async function checkIfSessionExists(sessionId: string) {
  return await redis.exists(sessionId);
}

export async function getSessionAsJson(sessionId: string) {
  let value = await redis.get(sessionId);
  if (!value) return null;

  return JSON.parse(value);
}

export async function sendToTheServer(sessionId: string, phoneNumber: string) {
  try {
    const data = await getSessionAsJson(sessionId);

    if (!data) throw new Error("Session not found");

    console.log("sendToTheServer", data);

    const response = await fetch(createOrderUrl, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        phoneNumber,
        sessionId,
        ...data,
      }),
    });

    const contentType = response.headers.get("content-type");

    if (!contentType || !contentType.includes("application/json")) {
      return {
        message:
          "An error occurred while processing your request. Please try again later.",
        success: false,
      };
    }

    const responseData: {
      success: boolean;
      message: string;
    } = await response.json();

    return responseData;
  } catch (error) {
    console.error(error);
    // Handle the error appropriately, e.g., by re-throwing it or returning a specific error response
    throw error; // or return a specific error response
  }
}
