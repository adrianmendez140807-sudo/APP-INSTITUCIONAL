import React, { useState, useEffect, useCallback } from 'react';
import { View, Text, FlatList, TouchableOpacity, StyleSheet, Alert } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import dbService from '../../../database';

export default function GestionNotasPU({ navigation }) {
  const [students, setStudents] = useState([]);

  const fetchStudents = useCallback(async () => {
    try {
      const allUsers = await dbService.getUsers();
      setStudents(allUsers.filter(u => u.role === 'estudiante'));
    } catch (error) {
      console.error("Error al obtener estudiantes:", error);
      Alert.alert("Error", "No se pudo cargar la lista de estudiantes.");
    }
  }, []);

  useEffect(() => {
    const unsubscribe = navigation.addListener('focus', () => {
      fetchStudents();
    });
    return unsubscribe;
  }, [navigation, fetchStudents]);

  const handleSelectStudent = (student) => {
    navigation.navigate('DetallesNotasEstudiante', { student });
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Gestión de Notas por Estudiante</Text>
      <FlatList
        data={students}
        keyExtractor={item => item.id.toString()}
        renderItem={({ item }) => (
          <TouchableOpacity style={styles.itemContainer} onPress={() => handleSelectStudent(item)}>
            <Ionicons name="person-circle-outline" size={40} color="#007bff" style={styles.icon} />
            <View style={styles.itemContent}>
              <Text style={styles.name}>{item.name}</Text>
              <Text style={styles.document}>Documento: {item.documentNumber}</Text>
            </View>
            <Ionicons name="chevron-forward-outline" size={24} color="#6c757d" />
          </TouchableOpacity>
        )}
        ListEmptyComponent={<Text style={styles.emptyText}>No hay estudiantes registrados.</Text>}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 20, backgroundColor: '#f8f9fa' },
  title: { fontSize: 24, fontWeight: 'bold', marginBottom: 20, color: '#343a40' },
  itemContainer: { flexDirection: 'row', alignItems: 'center', backgroundColor: '#ffffff', padding: 15, marginBottom: 12, borderRadius: 10, shadowColor: "#000", shadowOffset: { width: 0, height: 1 }, shadowOpacity: 0.05, shadowRadius: 2, elevation: 2 },
  icon: { marginRight: 15 },
  itemContent: { flex: 1 },
  name: { fontSize: 18, fontWeight: 'bold', color: '#495057' },
  document: { fontSize: 14, color: '#6c757d', marginTop: 4 },
  emptyText: { textAlign: 'center', marginTop: 50, fontSize: 16, color: '#6c757d' },
});
