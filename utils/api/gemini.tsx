// utils/geminiApi.ts
import Constants from "expo-constants";
const GEMINI_API_URL =
  "https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent";
const API_KEY = Constants.expoConfig?.extra?.GEMINI_API_KEY;

export async function sendMessageToGemini(userMessage: string) {
  const requestBody = {
    contents: [
      {
        role: "user",
        parts: [{ text: userMessage }],
      },
    ],
  };

  try {
    const res = await fetch(`${GEMINI_API_URL}?key=${API_KEY}`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(requestBody),
    });

    const data = await res.json();

    console.log("🌟 Gemini raw response:", data);

    return (
      data?.candidates?.[0]?.content?.parts?.[0]?.text ||
      "Sorry, I’m not sure how to respond."
    );
  } catch (err) {
    console.error("❌ Gemini API error:", err);
    return "Something went wrong while talking to Gemini.";
  }
}
