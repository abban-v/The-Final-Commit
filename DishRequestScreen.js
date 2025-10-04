import React, { useState } from 'react';
import { View, Text, TextInput, Button, ActivityIndicator, Alert } from 'react-native';

// Example function to fetch a recipe summary from Spoonacular API (replace with your API key)
async function fetchRecipe(dishName) {
  try {
    const apiKey = 'YOUR_SPOONACULAR_API_KEY'; // Replace with your API key
    const res = await fetch(`https://api.spoonacular.com/recipes/complexSearch?query=${encodeURIComponent(dishName)}&number=1&apiKey=${apiKey}`);
    const data = await res.json();
    if (data.results && data.results.length > 0) {
      const recipeId = data.results[0].id;
      const recipeRes = await fetch(`https://api.spoonacular.com/recipes/${recipeId}/summary?apiKey=${apiKey}`);
      const recipeData = await recipeRes.json();
      return recipeData.summary || 'No recipe found.';
    }
    return 'No recipe found.';
  } catch (err) {
    return 'Error fetching recipe.';
  }
}

export default function DishRequestScreen({ navigation }) {
  const [dishName, setDishName] = useState('');
  const [loading, setLoading] = useState(false);

  const handleRequest = async () => {
    if (!dishName.trim()) {
      Alert.alert('Error', 'Please enter a dish name');
      return;
    }
    setLoading(true);
    const recipe = await fetchRecipe(dishName);
    // Generate a random session ID for demo (should use persistent/session in real app)
    const userSessionId = Math.random().toString(36).substring(2, 15);
    try {
      const res = await fetch('http://10.45.210.167:5000/api/dish-request', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ userSessionId, dishName, recipeUrl: recipe })
      });
      if (res.ok) {
        Alert.alert('Success', 'Dish request submitted!');
        navigation.goBack();
      } else {
        Alert.alert('Error', 'Failed to submit request');
      }
    } catch (err) {
      Alert.alert('Error', 'Could not connect to backend');
    }
    setLoading(false);
  };

  return (
    <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', padding: 20 }}>
      <Text style={{ fontSize: 20, marginBottom: 20 }}>Request a New Dish</Text>
      <TextInput
        placeholder="Dish Name"
        value={dishName}
        onChangeText={setDishName}
        style={{ borderWidth: 1, borderRadius: 8, width: '100%', marginBottom: 12, padding: 8 }}
      />
      {loading ? <ActivityIndicator /> : <Button title="Submit Request" onPress={handleRequest} />}
    </View>
  );
}
