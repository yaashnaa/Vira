export function getMealInsights(nutrition: any): string[] {
    const insights = [];
  
    if (nutrition.protein > 10) insights.push("high in protein");
    if (nutrition.fiber > 5) insights.push("a good source of fiber");
    if (nutrition.calories < 150) insights.push("low in calories");
    if (nutrition.sugar < 5) insights.push("low in sugar");
  
    return insights;
  }
  