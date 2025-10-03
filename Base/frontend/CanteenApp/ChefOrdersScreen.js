import React, { useEffect, useState } from 'react';
import { View, Text, FlatList, Button, ActivityIndicator, Alert } from 'react-native';

export default function ChefOrdersScreen() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch('http://localhost:5000/api/order')
      .then(res => res.json())
      .then(data => {
        setOrders(data);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, []);

  const handleStatus = async (id, status) => {
    try {
      const res = await fetch(`http://localhost:5000/api/order/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status })
      });
      if (res.ok) {
        Alert.alert('Success', `Order marked as ${status}`);
        setOrders(orders.map(o => o._id === id ? { ...o, status } : o));
      } else {
        Alert.alert('Error', 'Failed to update order');
      }
    } catch {
      Alert.alert('Error', 'Could not connect to backend');
    }
  };

  if (loading) return <ActivityIndicator style={{ flex: 1 }} />;

  return (
    <View style={{ flex: 1, padding: 20 }}>
      <Text style={{ fontSize: 24, marginBottom: 20 }}>Orders (Chef)</Text>
      {orders.length === 0 ? (
        <Text>No orders found.</Text>
      ) : (
        <FlatList
          data={orders}
          keyExtractor={item => item._id}
          renderItem={({ item }) => (
            <View style={{ marginBottom: 16, padding: 12, borderWidth: 1, borderRadius: 8 }}>
              <Text style={{ fontSize: 18 }}>Order ID: {item._id}</Text>
              <Text>Status: {item.status}</Text>
              <Text>Total: ₹{item.totalPrice}</Text>
              <Text>Items:</Text>
              {item.items.map((i, idx) => (
                <Text key={idx}>- {i.menuItem?.name || 'Item'} x {i.quantity}</Text>
              ))}
              <View style={{ flexDirection: 'row', marginTop: 8 }}>
                <Button title="Preparing" onPress={() => handleStatus(item._id, 'preparing')} />
                <Button title="Ready" onPress={() => handleStatus(item._id, 'ready')} />
                <Button title="Completed" onPress={() => handleStatus(item._id, 'completed')} />
              </View>
            </View>
          )}
        />
      )}
    </View>
  );
}
