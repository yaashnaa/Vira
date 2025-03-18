import {View, StyleSheet, Text} from "react-native";
import React from "react";
import Onboarding from 'react-native-onboarding-swiper';

export default function OnBoarding() {
    return (
        <View style={styles.container}>
            <Onboarding
            pages={[
                {
                backgroundColor: '#fff',
                image: <Text>1</Text>,
                title: 'Onboarding',
                subtitle: 'Done with React Native Onboarding Swiper',
                },
                {
                    backgroundColor: '#fff',
                    image: <Text>1</Text>,
                    title: 'hi',
                    subtitle: 'Done with React Native Onboarding Swiper',
                    },
                
            ]}
        />
        </View>
    )

}
const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: "#fff"
    }

})