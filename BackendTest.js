import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet } from 'react-native';

const API_URL = 'http://10.45.210.167:5000'; // Change to your backend URL if needed

export default function BackendTest() {
  const [message, setMessage] = useState('Connecting...');

  useEffect(() => {
    fetch(API_URL)
      .then(res => res.text())
      .then(data => setMessage(data))
      .catch(err => setMessage('Error: ' + err.message));
  }, []);

  return (
    <View style={styles.container}>
      <Text>{message}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
});
