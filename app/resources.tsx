import React from 'react';
import { View, Text, StyleSheet } from 'react-native';

const Resources: React.FC = () => {
    return (
        <View style={styles.container}>
            <Text style={styles.title}>Community Screen</Text>
            {/* Add your components or content here */}
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#f5f5f5',
    },
    title: {
        fontSize: 24,
        fontWeight: 'bold',
        color: '#333',
    },
});

export default Resources;