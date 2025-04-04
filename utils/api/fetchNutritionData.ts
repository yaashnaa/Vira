import { getNutritionData } from "../nutritionix";
type NutritionTotals = {
    calories: number;
    protein: number;
    carbs: number;
    fat: number;
  };
  
  export async function fetchNutritionData(query: string): Promise<NutritionTotals> {
    const data = await getNutritionData(query);
  
    if (!data || !data.foods || !Array.isArray(data.foods)) {
      throw new Error("Invalid response from Nutritionix");
    }
  
    const totals: NutritionTotals = data.foods.reduce(
      (acc: NutritionTotals, food: any) => {
        acc.calories += food.nf_calories || 0;
        acc.protein += food.nf_protein || 0;
        acc.carbs += food.nf_total_carbohydrate || 0;
        acc.fat += food.nf_total_fat || 0;
        return acc;
      },
      { calories: 0, protein: 0, carbs: 0, fat: 0 }
    );
  
    return totals;
  }
  