import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, FlatList, ActivityIndicator, Alert } from 'react-native';
import dbService from '../../../database';

export default function DocentesList() {
  const [docentes, setDocentes] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchDocentes = async () => {
      try {
        const allUsers = await dbService.getUsers();
        const teacherUsers = allUsers.filter(user => user.role === 'docente');
        setDocentes(teacherUsers);
      } catch (error) {
        console.error("Error al cargar la lista de docentes:", error);
        Alert.alert("Error", "No se pudo cargar la lista de docentes.");
      } finally {
        setLoading(false);
      }
    };

    fetchDocentes();
  }, []);

  if (loading) {
    return <ActivityIndicator size="large" color="#007bff" style={styles.loader} />;
  }

  const renderItem = ({ item }) => (
    <View style={styles.itemContainer}>
      <Text style={styles.name}>{item.name}</Text>
      <Text style={styles.subjects}>Materias: {item.materias || 'No asignadas'}</Text>
    </View>
  );

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Lista de Docentes</Text>
      <FlatList
        data={docentes}
        renderItem={renderItem}
        keyExtractor={item => item.id.toString()}
        ListEmptyComponent={<Text style={styles.emptyText}>No hay docentes registrados.</Text>}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 20, backgroundColor: '#f8f9fa' },
  loader: { flex: 1, justifyContent: 'center', alignItems: 'center' },
  title: { fontSize: 24, fontWeight: 'bold', marginBottom: 20, color: '#343a40', textAlign: 'center' },
  itemContainer: {
    backgroundColor: '#ffffff',
    padding: 20,
    marginBottom: 12,
    borderRadius: 10,
    elevation: 3,
  },
  name: { fontSize: 18, fontWeight: 'bold', color: '#495057' },
  subjects: { fontSize: 14, color: '#6c757d', marginTop: 5, fontStyle: 'italic' },
  emptyText: { textAlign: 'center', marginTop: 50, color: '#888', fontSize: 16 },
});
