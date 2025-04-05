import React from 'react';
import { useRouter, Link } from "expo-router";
import WidgetCard from "../widgetCard";
const NutritionWidget: React.FC = () => {
 
    const router = useRouter();
    const handlePress = () => {
         router.replace("/nurtition");
    };

    return (
        <WidgetCard
        title="Nutrition"
        image={require('../../assets/images/widgetImages/vegetable.jpg')}
        route="/nurtition"
      />
    );
};

export default NutritionWidget;