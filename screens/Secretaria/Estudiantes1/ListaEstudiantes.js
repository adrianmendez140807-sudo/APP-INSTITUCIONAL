import React, { useEffect, useState, useCallback } from 'react';
import { View, Text, FlatList, TouchableOpacity, StyleSheet, Alert } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import dbService from '../../../database';

export default function ListaEstudiantes({ navigation }) {
  const [students, setStudents] = useState([]);

  const fetchStudents = useCallback(async () => {
    try {
      const allUsers = await dbService.getUsers();
      // Filtra solo estudiantes
      setStudents(allUsers.filter(u => u.role === 'estudiante'));
    } catch (error) {
      console.error("Error al obtener estudiantes:", error);
      Alert.alert("Error", "No se pudo cargar la lista de estudiantes.");
    }
  }, []);

  useEffect(() => {
    // Carga inicial
    fetchStudents(); 

    // Agrega un listener para actualizar la lista cuando la pantalla obtiene el foco
    const unsubscribe = navigation.addListener('focus', () => {
      fetchStudents();
    });

    return unsubscribe;
  }, [navigation, fetchStudents]);

  const handleSelectStudent = (student) => {
    navigation.navigate('BaseDatosEstudiantes', { student });
  };

  const handleDeleteStudent = (studentId) => {
    Alert.alert(
      "Confirmar Eliminación",
      "¿Estás seguro de que quieres eliminar a este estudiante? Esta acción no se puede deshacer.",
      [
        { text: "Cancelar", style: "cancel" },
        { 
          text: "Eliminar", 
          onPress: async () => {
            try {
              await dbService.deleteUser(studentId);
              Alert.alert("Éxito", "El estudiante ha sido eliminado.");
              fetchStudents(); // Refrescar la lista
            } catch (error) {
              console.error("Error al eliminar estudiante:", error);
              Alert.alert("Error", "No se pudo eliminar al estudiante.");
            }
          },
          style: "destructive"
        }
      ]
    );
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Lista de Estudiantes</Text>
      <FlatList
        data={students}
        keyExtractor={item => item.id.toString()}
        renderItem={({ item }) => (
          <View style={styles.itemContainer}>
            <TouchableOpacity style={styles.itemContent} onPress={() => handleSelectStudent(item)}>
              <Text style={styles.name}>{item.name}</Text>
              <Text style={styles.document}>Documento: {item.documentNumber}</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.deleteButton} onPress={() => handleDeleteStudent(item.id)}>
              <Ionicons name="trash-outline" size={24} color="#e74c3c" />
            </TouchableOpacity>
          </View>
        )}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { 
    flex: 1, 
    padding: 20, 
    backgroundColor: '#f8f9fa' 
  },
  title: { 
    fontSize: 24, 
    fontWeight: 'bold', 
    marginBottom: 20, 
    color: '#343a40' 
  },
  itemContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#ffffff',
    marginBottom: 12,
    borderRadius: 8,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 3,
    elevation: 3,
  },
  itemContent: {
    flex: 1,
    padding: 15,
  },
  name: { fontSize: 18, fontWeight: 'bold', color: '#495057' },
  document: { fontSize: 14, color: '#6c757d', marginTop: 4 },
  deleteButton: { padding: 15 },
});
