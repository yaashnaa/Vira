// components/Journal/CBTPromptSelector.tsx
import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, FlatList } from 'react-native';

const promptCategories: Array<keyof typeof prompts> = [
  'Understanding Negative Thought Patterns',
  'Challenging Negative Thoughts',
  'Monitoring Behavioral Patterns',
  'Developing Emotional Intelligence',
  'Increasing Mindful Thinking',
];
  
const prompts = {
  'Understanding Negative Thought Patterns': [
    'Identify a recent situation where you felt a strong negative emotion. What thoughts were going through your mind at that time?',
    'Reflect on a recurring negative thought you have. What evidence supports or contradicts this thought?',
    // Add more prompts as needed
  ],
  'Challenging Negative Thoughts': [
    'Think of a negative belief you hold about yourself. What are some alternative, more balanced perspectives?',
    'Recall a time when you overcame a negative thought. What strategies did you use?',
    // Add more prompts as needed
  ],
  'Monitoring Behavioral Patterns': [
    'Describe a behavior you engage in when feeling stressed. What triggers this behavior?',
    'Track your reactions to a specific situation over a week. What patterns do you notice?',
    // Add more prompts as needed
  ],
  'Developing Emotional Intelligence': [
    'Write about a time when you managed your negative emotions well. What techniques did you apply?',
    'Reflect on a situation where you failed to understand someone\'s emotions. How could this misunderstanding have been avoided?',
    // Add more prompts as needed
  ],
  'Increasing Mindful Thinking': [
    'Detail an instance when you were completely present in a moment. How did it make you feel?',
    'List three ways you could incorporate mindfulness into your daily routine.',
    // Add more prompts as needed
  ],
};

export default function CBTPromptSelector() {
  const [selectedCategory, setSelectedCategory] = useState<keyof typeof prompts | null>(null);

  return (
    <View style={styles.container}>
      <Text style={styles.title}>📝 What kind of prompt would you like today?</Text>
      {selectedCategory === null ? (
        <FlatList
          data={promptCategories}
          keyExtractor={(item) => item}
          renderItem={({ item }: { item: keyof typeof prompts }) => (
            <TouchableOpacity
              style={styles.categoryButton}
              onPress={() => setSelectedCategory(item)}
            >
              <Text style={styles.categoryText}>{item}</Text>
            </TouchableOpacity>
          )}
        />
      ) : (
        <View>
          <Text style={styles.subtitle}>{selectedCategory}</Text>
          {selectedCategory && prompts[selectedCategory].map((prompt, index) => (
            <Text key={index} style={styles.promptText}>
              • {prompt}
            </Text>
          ))}
          <TouchableOpacity
            style={styles.backButton}
            onPress={() => setSelectedCategory(null)}
          >
            <Text style={styles.backButtonText}>← Back to categories</Text>
          </TouchableOpacity>
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    marginVertical: 16,
    padding: 16,
    backgroundColor: '#f4f0f8',
    borderRadius: 12,
  },
  title: {
    fontSize: 18,
    fontWeight: '600',
    color: '#4e2a7e',
    marginBottom: 12,
  },
  categoryButton: {
    padding: 12,
    backgroundColor: '#e6dbf5',
    borderRadius: 8,
    marginBottom: 8,
  },
  categoryText: {
    fontSize: 16,
    color: '#4e2a7e',
  },
  subtitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#4e2a7e',
    marginBottom: 8,
  },
  promptText: {
    fontSize: 14,
    color: '#333',
    marginBottom: 6,
  },
  backButton: {
    marginTop: 12,
  },
  backButtonText: {
    color: '#4e2a7e',
    textDecorationLine: 'underline',
  },
});
