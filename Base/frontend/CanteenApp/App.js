import React, { useState, useEffect } from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import { View, Text, Button, TouchableOpacity, FlatList, StyleSheet, TextInput, Alert, ActivityIndicator } from 'react-native';
import DishRequestScreen from './DishRequestScreen';
import UserDishRequestsScreen from './UserDishRequestsScreen';
import ChefDishRequestsScreen from './ChefDishRequestsScreen';
import UPIPaymentScreen from './UPIPaymentScreen';
import ChefOrdersScreen from './ChefOrdersScreen';
import { CartProvider, useCart } from './CartContext';

// ...existing code...


// Role selection screen
function RoleSelectionScreen({ navigation }) {
  return (
    <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
      <Text style={{ fontSize: 24, marginBottom: 20 }}>Are you a Chef or Ordering Food?</Text>
      <Button title="Chef" onPress={() => navigation.navigate('ChefLogin')} />
      <Button title="Order Food" onPress={() => navigation.navigate('Menu')} />
    </View>
  );
}

// Chef login screen
function ChefLoginScreen({ navigation }) {
  const [userId, setUserId] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);

  const handleLogin = async () => {
    setLoading(true);
    try {
      const res = await fetch('http://localhost:5000/api/chef/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ userId, password })
      });
      const data = await res.json();
      if (res.ok) {
        Alert.alert('Success', 'Login successful!');
      } else {
        Alert.alert('Login Failed', data.message || 'Invalid credentials');
      }
    } catch (err) {
      Alert.alert('Error', 'Could not connect to backend');
    }
    setLoading(false);
  };

  return (
    <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', padding: 20 }}>
      <Text style={{ fontSize: 20, marginBottom: 20 }}>Chef Login</Text>
      <TextInput
        placeholder="User ID"
        value={userId}
        onChangeText={setUserId}
        autoCapitalize="none"
        style={{ borderWidth: 1, borderRadius: 8, width: '100%', marginBottom: 12, padding: 8 }}
      />
      <TextInput
        placeholder="Password"
        value={password}
        onChangeText={setPassword}
        secureTextEntry
        style={{ borderWidth: 1, borderRadius: 8, width: '100%', marginBottom: 12, padding: 8 }}
      />
      <Button title={loading ? 'Logging in...' : 'Login'} onPress={handleLogin} disabled={loading} />
      <Button title="View Dish Requests (Chef)" onPress={() => navigation.navigate('ChefDishRequests')} />
      <Button title="View Orders (Chef)" onPress={() => navigation.navigate('ChefOrders')} />
    </View>
  );
}

// Menu screen
function MenuScreen({ navigation }) {
  const { addToCart } = useCart();
  const [menu, setMenu] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetch('http://localhost:5000/api/menu')
      .then(res => res.json())
      .then(data => {
        setMenu(data);
        setLoading(false);
      })
      .catch(err => {
        setError('Failed to load menu');
        setLoading(false);
      });
  }, []);

  if (loading) return <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}><ActivityIndicator size="large" /><Text>Loading menu...</Text></View>;
  if (error) return <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}><Text>{error}</Text></View>;

  return (
    <View style={{ flex: 1, padding: 20 }}>
      <Text style={{ fontSize: 24, marginBottom: 20 }}>Menu</Text>
      <Button title="Go to Cart" onPress={() => navigation.navigate('Cart')} />
      <Button title="My Dish Requests" onPress={() => navigation.navigate('UserDishRequests')} />
      {menu.length === 0 ? (
        <Text>No menu items found.</Text>
      ) : (
        <FlatList
          data={menu}
          keyExtractor={item => item._id}
          renderItem={({ item }) => (
            <View style={{ marginBottom: 16, padding: 12, borderWidth: 1, borderRadius: 8 }}>
              <Text style={{ fontSize: 18 }}>{item.name}</Text>
              <Text>{item.description}</Text>
              <Text>₹{item.price}</Text>
              <Text>{item.available ? 'Available' : 'Not Available'}</Text>
              <Button title="Add to Cart" onPress={() => addToCart(item)} disabled={!item.available} />
            </View>
          )}
        />
      )}
      <TouchableOpacity
        style={styles.fab}
        onPress={() => navigation.navigate('DishRequest')}
        accessibilityLabel="Request New Dish"
      >
        <Text style={{ fontSize: 32, color: 'white' }}>+</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  fab: {
    position: 'absolute',
    right: 24,
    bottom: 24,
    backgroundColor: '#007AFF',
    width: 56,
    height: 56,
    borderRadius: 28,
    justifyContent: 'center',
    alignItems: 'center',
    elevation: 4,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 2
  }
});

// Cart screen
function CartScreen({ navigation }) {
  const { cart, removeFromCart, updateQuantity, clearCart } = useCart();
  const [placingOrder, setPlacingOrder] = useState(false);

  const handlePlaceOrder = async () => {
    setPlacingOrder(true);
    try {
      const userSessionId = Math.random().toString(36).substring(2, 15);
      const items = cart.map(i => ({ menuItem: i.menuItem._id, quantity: i.quantity }));
      const res = await fetch('http://localhost:5000/api/order', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ items, userSessionId })
      });
      if (res.ok) {
        clearCart();
        navigation.navigate('UPIPayment');
      } else {
        alert('Failed to place order');
      }
    } catch (err) {
      alert('Error connecting to backend');
    }
    setPlacingOrder(false);
  };

  return (
    <View style={{ flex: 1, padding: 20 }}>
      <Text style={{ fontSize: 24, marginBottom: 20 }}>Cart</Text>
      {cart.length === 0 ? (
        <Text>Your cart is empty.</Text>
      ) : (
        <FlatList
          data={cart}
          keyExtractor={item => item.menuItem._id}
          renderItem={({ item }) => (
            <View style={{ marginBottom: 16, padding: 12, borderWidth: 1, borderRadius: 8 }}>
              <Text style={{ fontSize: 18 }}>{item.menuItem.name}</Text>
              <Text>₹{item.menuItem.price}</Text>
              <Text>Quantity: {item.quantity}</Text>
              <View style={{ flexDirection: 'row', marginTop: 8 }}>
                <Button title="-" onPress={() => updateQuantity(item.menuItem._id, item.quantity - 1)} disabled={item.quantity <= 1} />
                <Button title="+" onPress={() => updateQuantity(item.menuItem._id, item.quantity + 1)} />
                <Button title="Remove" onPress={() => removeFromCart(item.menuItem._id)} />
              </View>
            </View>
          )}
        />
      )}
      {cart.length > 0 && (
        <Button title={placingOrder ? 'Placing Order...' : 'Place Order'} onPress={handlePlaceOrder} disabled={placingOrder} />
      )}
    </View>
  );
}

const Stack = createStackNavigator();

export default function App() {
  return (
    <CartProvider>
      <NavigationContainer>
        <Stack.Navigator initialRouteName="RoleSelection">
          <Stack.Screen name="RoleSelection" component={RoleSelectionScreen} options={{ title: 'Welcome' }} />
          <Stack.Screen name="ChefLogin" component={ChefLoginScreen} options={{ title: 'Chef Login' }} />
          <Stack.Screen name="Menu" component={MenuScreen} options={{ title: 'Menu' }} />
          <Stack.Screen name="Cart" component={CartScreen} options={{ title: 'Cart' }} />
          <Stack.Screen name="DishRequest" component={DishRequestScreen} options={{ title: 'Request New Dish' }} />
          <Stack.Screen name="UserDishRequests" component={UserDishRequestsScreen} options={{ title: 'My Dish Requests' }} />
          <Stack.Screen name="ChefDishRequests" component={ChefDishRequestsScreen} options={{ title: 'Dish Requests (Chef)' }} />
          <Stack.Screen name="UPIPayment" component={UPIPaymentScreen} options={{ title: 'UPI Payment' }} />
          <Stack.Screen name="ChefOrders" component={ChefOrdersScreen} options={{ title: 'Orders (Chef)' }} />
        </Stack.Navigator>
      </NavigationContainer>
    </CartProvider>
  );
}
