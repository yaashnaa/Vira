import React from 'react';
import { View, Text, Image, TouchableOpacity, StyleSheet, ImageSourcePropType, Dimensions } from 'react-native';
import { useRouter } from 'expo-router';

interface WidgetCardProps {
  title: string;
  image: ImageSourcePropType;
  route: string;
}

const WidgetCard: React.FC<WidgetCardProps> = ({ title, image, route }) => {
  const router = useRouter();

  const handlePress = () => {
    router.push(route as any); // push instead of replace to preserve back behavior
  };

  return (
    <TouchableOpacity style={styles.card} onPress={handlePress}>
      <Image source={image} style={styles.image} />
      <Text style={styles.text}>{title}</Text>
    </TouchableOpacity>
  );
};
const { width } = Dimensions.get("window");
const styles = StyleSheet.create({
  card: {
    backgroundColor: '#fff',
    borderRadius: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 6,
    elevation: 4,
    padding: 12,
    alignItems: 'center',
    margin: 10,
    width: width * 0.38,
  },
  image: {
    width: 140,
    height: 140,
    borderRadius: 10,
    marginBottom: 10,
    resizeMode: 'cover',
  },
  text: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333',
    textAlign: 'center',
    fontFamily: 'Comfortaa-Regular',
  },
});

export default WidgetCard;
