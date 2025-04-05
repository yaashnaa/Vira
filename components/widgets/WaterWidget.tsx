import React from 'react';
import { useRouter, Link } from "expo-router";
import WidgetCard from "../widgetCard";
const WaterWidget: React.FC = () => {
 
    const router = useRouter();
    const handlePress = () => {
         router.replace("/waterTracker");
    };

    return (
        <WidgetCard
        title="Water tracker"
        image={require('../../assets/images/widgetImages/water.jpg')}
        route="/waterTracker"
      />
    );
};

export default WaterWidget;