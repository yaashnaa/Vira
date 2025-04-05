import React from 'react';
import { useRouter, Link } from "expo-router";
import WidgetCard from "../widgetCard";
const FitnessWidget: React.FC = () => {
 
    const router = useRouter();
    const handlePress = () => {
         router.replace("/fitness");
    };

    return (
        <WidgetCard
        title="Fitness"
        image={require('../../assets/images/widgetImages/stretch.jpg')}
        route="/fitness"
      />
    );
};

export default FitnessWidget;