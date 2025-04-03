import Constants from "expo-constants";

const API_KEY = Constants.expoConfig?.extra?.TASTY_API_KEY;

export async function searchTastyRecipes(query: string) {
  const res = await fetch(`https://tasty.p.rapidapi.com/recipes/list?from=0&size=10&q=${query}`, {
    method: "GET",
    headers: {
      "X-RapidAPI-Key": API_KEY,
      "X-RapidAPI-Host": "tasty.p.rapidapi.com",
    },
  });

  if (!res.ok) throw new Error("Tasty API error");
  return res.json();
}
