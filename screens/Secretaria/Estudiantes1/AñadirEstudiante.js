// screens/Secretaria/AñadirEstudiante.js
import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, Button, Alert, StyleSheet } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import uuid from 'react-native-uuid';

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
      id: uuid.v4(), // genera un id único
      nombre,
      usuario,
      contraseña,
      role: 'estudiante',
    };

    const nuevaLista = [...estudiantes, nuevoEstudiante];

    try {
      await AsyncStorage.setItem('estudiantes', JSON.stringify(nuevaLista));
      setEstudiantes(nuevaLista);

      // Limpiar campos después de guardar
      setNombre('');
      setUsuario('');
      setContraseña('');

      Alert.alert('Éxito', 'Estudiante registrado correctamente.');
      navigation.navigate('ListaEstudiantes'); // redirigir directamente a la lista
    } catch (error) {
      console.log('Error guardando estudiante:', error);
      Alert.alert('Error', 'No se pudo guardar el estudiante.');
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.label}>Nombre:</Text>
      <TextInput
        style={styles.input}
        value={nombre}
        onChangeText={setNombre}
        placeholder="Ingrese nombre"
      />

      <Text style={styles.label}>Usuario:</Text>
      <TextInput
        style={styles.input}
        value={usuario}
        onChangeText={setUsuario}
        placeholder="Ingrese usuario"
      />

      <Text style={styles.label}>Contraseña:</Text>
      <TextInput
        style={styles.input}
        secureTextEntry
        value={contraseña}
        onChangeText={setContraseña}
        placeholder="Ingrese contraseña"
      />

      <Button title="Guardar" onPress={handleGuardar} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 20, backgroundColor: '#fff' },
  label: { fontWeight: 'bold', marginBottom: 5 },
  input: {
    borderWidth: 1,
    borderColor: '#ccc',
    marginBottom: 12,
    padding: 10,
    borderRadius: 6,
  },
});
