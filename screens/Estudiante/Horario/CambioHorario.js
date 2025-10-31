import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, FlatList, ActivityIndicator, Alert } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import dbService from '../../../database';

export default function CambioHorario() {
  const [cambios, setCambios] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadCambios = async () => {
      try {
        const userString = await AsyncStorage.getItem('currentUser');
        if (!userString) throw new Error("No se encontró información del usuario.");
        
        const currentUser = JSON.parse(userString);
        if (!currentUser.grado) return;

        const formatDate = (d) => `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`;
        const hoy = new Date();

        const data = await dbService.getCambiosHorario(currentUser.grado, formatDate(hoy));
        setCambios(data);

      } catch (error) {
        Alert.alert("Error", "No se pudieron cargar los cambios de horario.");
      } finally {
        setLoading(false);
      }
    };
    loadCambios();
  }, []);

  if (loading) {
    return <ActivityIndicator size="large" color="#007bff" style={styles.loader} />;
  }

  const renderItem = ({ item }) => (
    <View style={styles.card}>
      <Text style={styles.dateText}>Para el día: {item.fecha_cambio}</Text>
      <Text style={styles.descriptionText}>{item.descripcion}</Text>
      <Text style={styles.gradeText}>Aplica a: {item.grado}</Text>
    </View>
  );

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Anuncios y Cambios de Horario</Text>
      <FlatList
        data={cambios}
        renderItem={renderItem}
        keyExtractor={item => item.id.toString()}
        ListEmptyComponent={<Text style={styles.emptyText}>No hay cambios de horario publicados para los próximos días.</Text>}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 15, backgroundColor: '#f4f7f6' },
  loader: { flex: 1, justifyContent: 'center', alignItems: 'center' },
  title: { fontSize: 24, fontWeight: 'bold', textAlign: 'center', marginBottom: 20, color: '#333' },
  card: {
    backgroundColor: '#fff',
    borderRadius: 10,
    padding: 20,
    marginBottom: 15,
    elevation: 3,
    borderLeftWidth: 5,
    borderLeftColor: '#ffc107',
  },
  dateText: { fontSize: 16, fontWeight: 'bold', color: '#007bff', marginBottom: 8 },
  descriptionText: { fontSize: 16, color: '#495057', lineHeight: 22, marginBottom: 10 },
  gradeText: { fontSize: 12, color: '#888', fontStyle: 'italic', textAlign: 'right' },
  emptyText: { fontSize: 16, color: '#888', textAlign: 'center', marginTop: 40 },
});
