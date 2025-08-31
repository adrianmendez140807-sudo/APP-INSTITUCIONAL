// screens/Secretaria/ListaEstudiantes.js
import React, { useState, useEffect } from 'react';
import { View, Text, FlatList, StyleSheet } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';

export default function ListaEstudiantes() {
  const [estudiantes, setEstudiantes] = useState([]);

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

    const focusListener = cargarEstudiantes; // para que se actualice al volver
    focusListener();

  }, []);

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Lista de Estudiantes</Text>
      {estudiantes.length === 0 ? (
        <Text>No hay estudiantes registrados</Text>
      ) : (
        <FlatList
          data={estudiantes}
          keyExtractor={(item) => item.id}
          renderItem={({ item }) => (
            <View style={styles.card}>
              <Text style={styles.nombre}>{item.nombre}</Text>
              <Text>Usuario: {item.usuario}</Text>
            </View>
          )}
        />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 20, backgroundColor: '#fff' },
  title: { fontSize: 22, fontWeight: 'bold', marginBottom: 15 },
  card: {
    backgroundColor: '#f9f9f9',
    padding: 12,
    marginVertical: 6,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#ddd',
  },
  nombre: { fontWeight: 'bold', fontSize: 16 },
});
