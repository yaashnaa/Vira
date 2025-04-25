// utils/fetchTastyRecipes.ts
import Constants from "expo-constants";

export interface TastyRecipe {
  id: number;
  name: string;
  description?: string;
  thumbnail_url: string;
  video_url?: string;
  tags?: { name: string }[]; 
 
}
export async function fetchTastyRecipes(query = "", tags: string[] = [], from=0) {
  const tagString = tags.join(",");
  const randomOffset = Math.floor(Math.random() * 100); 
  console.log("Random Offset:", randomOffset);

  const url = `https://tasty.p.rapidapi.com/recipes/list?from=${from}&size=100&q=${query}&tags=${tagString}`;

  const res = await fetch(url, {
    method: "GET",
    headers: {
      "X-RapidAPI-Key": Constants.expoConfig?.extra?.TASTY_API_KEY,
      "X-RapidAPI-Host": "tasty.p.rapidapi.com",
    },
  });

  if (!res.ok) throw new Error("Failed to fetch recipes from Tasty");
  const data = await res.json();
  return data.results as TastyRecipe[];
}
