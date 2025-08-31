// components/LogoutButton.js
import React from 'react';
import { TouchableOpacity, Text, StyleSheet } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';

export default function LogoutButton({ navigation }) {
  const handleLogout = async () => {
    try {
      await AsyncStorage.removeItem('currentUser');
      navigation.replace('Login');
    } catch (e) {
      console.log('Error al cerrar sesión:', e);
    }
  };

  return (
    <TouchableOpacity style={styles.btn} onPress={handleLogout}>
      <Text style={styles.text}>Cerrar sesión</Text>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  btn: { padding: 10, backgroundColor: '#e74c3c', borderRadius: 6, alignItems: 'center' },
  text: { color: '#fff', fontWeight: 'bold' },
});
