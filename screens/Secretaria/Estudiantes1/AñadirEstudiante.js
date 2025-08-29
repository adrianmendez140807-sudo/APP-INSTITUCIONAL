// screens/Secretaria/AñadirEstudiante.js
import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, Button, Alert, StyleSheet } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { v4 as uuidv4 } from 'uuid';

export default function AñadirEstudiante({ navigation }) {
  const [nombre, setNombre] = useState('');
  const [usuario, setUsuario] = useState('');
  const [contraseña, setContraseña] = useState('');
  const [estudiantes, setEstudiantes] = useState([]);

  // Cargar estudiantes al iniciar
  useEffect(() => {
    const cargarEstudiantes = async () => {
      try {
        const data = await AsyncStorage.getItem('estudiantes');
        if (data) {
          setEstudiantes(JSON.parse(data));
        }
      } catch (error) {
        console.log('Error cargando estudiantes:', error);
      }
    };
    cargarEstudiantes();
  }, []);

  const handleGuardar = async () => {
    if (!nombre.trim() || !usuario.trim() || !contraseña.trim()) {
      Alert.alert('Error', 'Todos los campos son obligatorios.');
      return;
    }

    const nuevoEstudiante = {
      id: uuidv4(),
      nombre,
      usuario,
      contraseña,
      role: 'estudiante'
    };

    const nuevaLista = [...estudiantes, nuevoEstudiante];

    try {
      await AsyncStorage.setItem('estudiantes', JSON.stringify(nuevaLista));
      setEstudiantes(nuevaLista);
      Alert.alert('Éxito', 'Estudiante registrado correctamente.');
      navigation.goBack();
    } catch (error) {
      console.log('Error guardando estudiante:', error);
      Alert.alert('Error', 'No se pudo guardar el estudiante.');
    }
  };

  return (
    <View style={styles.container}>
      <Text>Nombre:</Text>
      <TextInput style={styles.input} value={nombre} onChangeText={setNombre} />

      <Text>Usuario:</Text>
      <TextInput style={styles.input} value={usuario} onChangeText={setUsuario} />

      <Text>Contraseña:</Text>
      <TextInput style={styles.input} secureTextEntry value={contraseña} onChangeText={setContraseña} />

      <Button title="Guardar" onPress={handleGuardar} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 20 },
  input: { borderWidth: 1, marginBottom: 12, padding: 8, borderRadius: 4 }
});
