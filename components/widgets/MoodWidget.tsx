import React from 'react';
import { useRouter, Link } from "expo-router";
import WidgetCard from "../widgetCard";
const MoodWidget: React.FC = () => {
 
    const router = useRouter();
    const handlePress = () => {
         router.replace("/mood");
    };

    return (
        <WidgetCard
        title="Mood Tracker"
        image={require('../../assets/images/widgetImages/mood.jpg')}
        route="/mood"
      />
    );
};

export default MoodWidget;