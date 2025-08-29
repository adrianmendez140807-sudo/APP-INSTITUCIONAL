import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, ImageBackground, Alert } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { LinearGradient } from 'expo-linear-gradient';

export default function LoginScreen({ navigation }) {
  const [usuario, setUsuario] = useState('');
  const [contraseña, setContraseña] = useState('');
  const [recordar, setRecordar] = useState(false);

  useEffect(() => {
    const cargarUsuario = async () => {
      const savedUser = await AsyncStorage.getItem('savedUser');
      if (savedUser) {
        setUsuario(savedUser);
        setRecordar(true);
      }
    };
    cargarUsuario();
  }, []);

  const handleLogin = async () => {
    if (!usuario.trim() || !contraseña.trim()) {
      Alert.alert('Error', 'Debes llenar todos los campos');
      return;
    }

    if (recordar) {
      await AsyncStorage.setItem('savedUser', usuario);
    } else {
      await AsyncStorage.removeItem('savedUser');
    }

    await AsyncStorage.setItem('currentUser', usuario);

    switch (usuario.toLowerCase()) {
      case 'secretaria':
        navigation.replace('SecretariaHome');
        break;
      case 'rectoria':
        navigation.replace('RectorHome');
        break;
      case 'coordinacion':
        navigation.replace('CoordinadorHome');
        break;
      case 'docente':
        navigation.replace('DocenteHome');
        break;
      case 'estudiante':
        navigation.replace('EstudianteHome');
        break;
      default:
        Alert.alert('Error', 'Usuario no reconocido');
    }
  };

  return (
    <ImageBackground
      source={{ uri: 'https://images.unsplash.com/photo-1523580846011-d3a5bc25702b' }}
      style={styles.background}
      blurRadius={3}
    >
      <LinearGradient colors={['rgba(0,0,0,0.7)', 'rgba(50,50,150,0.7)']} style={styles.overlay}>
        <View style={styles.container}>
          <Text style={styles.title}>Bienvenido</Text>

          <TextInput
            style={styles.input}
            placeholder="Usuario"
            placeholderTextColor="#ccc"
            value={usuario}
            onChangeText={setUsuario}
          />
          <TextInput
            style={styles.input}
            placeholder="Contraseña"
            placeholderTextColor="#ccc"
            secureTextEntry
            value={contraseña}
            onChangeText={setContraseña}
          />

          <TouchableOpacity
            style={[styles.checkbox, recordar && styles.checkboxChecked]}
            onPress={() => setRecordar(!recordar)}
          >
            <Text style={styles.checkboxText}>
              {recordar ? '✓ ' : ''}Recordar usuario
            </Text>
          </TouchableOpacity>

          <TouchableOpacity style={styles.button} onPress={handleLogin}>
            <LinearGradient colors={['#ff7e5f', '#feb47b']} style={styles.gradientButton}>
              <Text style={styles.buttonText}>Iniciar Sesión</Text>
            </LinearGradient>
          </TouchableOpacity>
        </View>
      </LinearGradient>
    </ImageBackground>
  );
}

const styles = StyleSheet.create({
  background: { flex: 1 },
  overlay: { flex: 1, justifyContent: 'center', alignItems: 'center' },
  container: { width: '85%', padding: 25, backgroundColor: 'rgba(255,255,255,0.1)', borderRadius: 20 },
  title: { fontSize: 28, color: '#fff', fontWeight: 'bold', textAlign: 'center', marginBottom: 20 },
  input: { width: '100%', padding: 15, backgroundColor: 'rgba(255,255,255,0.2)', borderRadius: 10, marginBottom: 15, color: '#fff' },
  checkbox: { marginBottom: 15 },
  checkboxChecked: { backgroundColor: 'rgba(255,255,255,0.1)', borderRadius: 5 },
  checkboxText: { color: '#fff' },
  button: { width: '100%', borderRadius: 10, overflow: 'hidden', marginTop: 10 },
  gradientButton: { padding: 15, alignItems: 'center' },
  buttonText: { color: '#fff', fontSize: 18, fontWeight: 'bold' }
});
