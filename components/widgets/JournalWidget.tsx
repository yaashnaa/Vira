import React from 'react';
import { useRouter, Link } from "expo-router";
import WidgetCard from "../widgetCard";
const JournalWidget: React.FC = () => {
 
    const router = useRouter();
    const handlePress = () => {
         router.replace("/journal");
    };

    return (
        <WidgetCard
        title="Journal"
        image={require('../../assets/images/widgetImages/journal.png')}
        route="/journal"
      />
    );
};

export default JournalWidget;