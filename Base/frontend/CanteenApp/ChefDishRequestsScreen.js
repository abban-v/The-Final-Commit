import React, { useEffect, useState } from 'react';
import { View, Text, FlatList, Button, ActivityIndicator, Alert } from 'react-native';

export default function ChefDishRequestsScreen() {
  const [requests, setRequests] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch('http://localhost:5000/api/dish-request?status=pending')
      .then(res => res.json())
      .then(data => {
        setRequests(data);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, []);

  const handleAction = async (id, status) => {
    // For demo: use a dummy chefId (should use real chefId in real app)
    const chefId = 'demo-chef-id';
    try {
      const res = await fetch(`http://localhost:5000/api/dish-request/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status, chefId })
      });
      if (res.ok) {
        Alert.alert('Success', `Request ${status}`);
        setRequests(requests.filter(r => r._id !== id));
      } else {
        Alert.alert('Error', 'Failed to update request');
      }
    } catch {
      Alert.alert('Error', 'Could not connect to backend');
    }
  };

  if (loading) return <ActivityIndicator style={{ flex: 1 }} />;

  return (
    <View style={{ flex: 1, padding: 20 }}>
      <Text style={{ fontSize: 24, marginBottom: 20 }}>Dish Requests (Chef)</Text>
      {requests.length === 0 ? (
        <Text>No pending requests.</Text>
      ) : (
        <FlatList
          data={requests}
          keyExtractor={item => item._id}
          renderItem={({ item }) => (
            <View style={{ marginBottom: 16, padding: 12, borderWidth: 1, borderRadius: 8 }}>
              <Text style={{ fontSize: 18 }}>{item.dishName}</Text>
              <Text>Status: {item.status}</Text>
              <Text numberOfLines={3}>Recipe: {item.recipeUrl}</Text>
              <View style={{ flexDirection: 'row', marginTop: 8 }}>
                <Button title="Approve" onPress={() => handleAction(item._id, 'approved')} />
                <Button title="Reject" onPress={() => handleAction(item._id, 'rejected')} />
              </View>
            </View>
          )}
        />
      )}
    </View>
  );
}
