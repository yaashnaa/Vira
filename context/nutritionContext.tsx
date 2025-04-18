
import React, { createContext, useContext, useState } from 'react';
const [mealsLogged, setMealsLogged] = useState<number>(0);
const [totalMeals, setTotalMeals] = useState<number>(3); // default or from userPreferences
const [nutritionTotals, setNutritionTotals] = useState({
  calories: 0,
  protein: 0,
  carbs: 0,
  fat: 0,
});
const [mealMood, setMealMood] = useState<string | undefined>();
