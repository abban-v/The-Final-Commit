import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Linking,
  Alert,
  Image,
  ScrollView,
} from 'react-native';

const UPIPaymentScreen = ({ route, navigation }) => {
  const { amount = 0, orderId = '', upiId = 'merchant@upi' } = route?.params || {};
  const [selectedMethod, setSelectedMethod] = useState(null);

  const upiApps = [
    { id: 'phonepe', name: 'PhonePe', package: 'com.phonepe.app', color: '#5f259f' },
    { id: 'gpay', name: 'Google Pay', package: 'com.google.android.apps.nbu.paisa.user', color: '#4285f4' },
    { id: 'paytm', name: 'Paytm', package: 'net.one97.paytm', color: '#00baf2' },
    { id: 'bhim', name: 'BHIM UPI', package: 'in.org.npci.upiapp', color: '#097939' },
  ];

  const handleUPIApp = async (app) => {
    try {
      // UPI deep link format
      const upiUrl = `upi://pay?pa=${upiId}&pn=Merchant&am=${amount}&cu=INR&tn=Payment for Order ${orderId}`;
      
      const canOpen = await Linking.canOpenURL(upiUrl);
      
      if (canOpen) {
        await Linking.openURL(upiUrl);
      } else {
        Alert.alert(
          'App Not Found',
          `${app.name} is not installed on your device. Please install it or try another payment method.`,
          [{ text: 'OK' }]
        );
      }
    } catch (error) {
      Alert.alert('Error', 'Failed to open payment app. Please try again.');
      console.error('UPI Error:', error);
    }
  };

  const handleQRPayment = () => {
    setSelectedMethod('qr');
    Alert.alert(
      'QR Code Payment',
      'QR code feature will be implemented soon. You can scan the QR code displayed to complete the payment.',
      [{ text: 'OK' }]
    );
  };

  return (
    <ScrollView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Payment Options</Text>
        <View style={styles.amountContainer}>
          <Text style={styles.amountLabel}>Amount to Pay:</Text>
          <Text style={styles.amount}>₹{amount.toFixed(2)}</Text>
        </View>
        {orderId && <Text style={styles.orderId}>Order ID: {orderId}</Text>}
      </View>

      {/* QR Code Option */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Scan QR Code</Text>
        <TouchableOpacity
          style={[
            styles.qrOption,
            selectedMethod === 'qr' && styles.selectedOption,
          ]}
          onPress={handleQRPayment}
        >
          <View style={styles.qrPlaceholder}>
            <Text style={styles.qrPlaceholderText}>QR Code</Text>
            <Text style={styles.qrSubtext}>Scan with any UPI app</Text>
          </View>
        </TouchableOpacity>
      </View>

      {/* UPI Apps Option */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Pay with UPI Apps</Text>
        <View style={styles.appsGrid}>
          {upiApps.map((app) => (
            <TouchableOpacity
              key={app.id}
              style={[
                styles.appButton,
                { backgroundColor: app.color },
              ]}
              onPress={() => handleUPIApp(app)}
            >
              <Text style={styles.appButtonText}>{app.name}</Text>
            </TouchableOpacity>
          ))}
        </View>
      </View>

      {/* Instructions */}
      <View style={styles.instructions}>
        <Text style={styles.instructionTitle}>How to pay:</Text>
        <Text style={styles.instructionText}>1. Select your preferred UPI app</Text>
        <Text style={styles.instructionText}>2. Verify the payment amount</Text>
        <Text style={styles.instructionText}>3. Complete the payment in the app</Text>
        <Text style={styles.instructionText}>4. Return here to confirm</Text>
      </View>

      {/* Cancel Button */}
      <TouchableOpacity
        style={styles.cancelButton}
        onPress={() => navigation.goBack()}
      >
        <Text style={styles.cancelButtonText}>Cancel Payment</Text>
      </TouchableOpacity>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  header: {
    backgroundColor: '#fff',
    padding: 20,
    borderBottomWidth: 1,
    borderBottomColor: '#e0e0e0',
    marginBottom: 20,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 15,
  },
  amountContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 10,
  },
  amountLabel: {
    fontSize: 16,
    color: '#666',
  },
  amount: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#4caf50',
  },
  orderId: {
    fontSize: 14,
    color: '#999',
  },
  section: {
    backgroundColor: '#fff',
    padding: 20,
    marginBottom: 15,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#333',
    marginBottom: 15,
  },
  qrOption: {
    alignItems: 'center',
    padding: 20,
    borderRadius: 10,
    borderWidth: 2,
    borderColor: '#e0e0e0',
    backgroundColor: '#fafafa',
  },
  selectedOption: {
    borderColor: '#4caf50',
    backgroundColor: '#f1f8f4',
  },
  qrPlaceholder: {
    width: 200,
    height: 200,
    backgroundColor: '#fff',
    borderRadius: 10,
    borderWidth: 2,
    borderColor: '#ddd',
    justifyContent: 'center',
    alignItems: 'center',
    borderStyle: 'dashed',
  },
  qrPlaceholderText: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#999',
  },
  qrSubtext: {
    fontSize: 14,
    color: '#bbb',
    marginTop: 10,
  },
  appsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },
  appButton: {
    width: '48%',
    padding: 20,
    borderRadius: 10,
    alignItems: 'center',
    marginBottom: 15,
    elevation: 3,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  appButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
  instructions: {
    backgroundColor: '#fff',
    padding: 20,
    marginBottom: 15,
  },
  instructionTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333',
    marginBottom: 10,
  },
  instructionText: {
    fontSize: 14,
    color: '#666',
    marginBottom: 5,
    paddingLeft: 5,
  },
  cancelButton: {
    backgroundColor: '#fff',
    padding: 15,
    margin: 20,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: '#e0e0e0',
    alignItems: 'center',
  },
  cancelButtonText: {
    color: '#f44336',
    fontSize: 16,
    fontWeight: '600',
  },
});

export default UPIPaymentScreen;