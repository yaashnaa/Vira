import React from 'react';
import { useRouter, Link } from "expo-router";
import WidgetCard from "../widgetCard";
const MindfullnessWidget: React.FC = () => {
 
    const router = useRouter();
    const handlePress = () => {
         router.replace("/nurtition");
    };

    return (
        <WidgetCard
        title="Mindfullness"
        image={require('../../assets/images/widgetImages/vegetable.jpg')}
        route="/mindfullness"
      />
    );
};

export default MindfullnessWidget;