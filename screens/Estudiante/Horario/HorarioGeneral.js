import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, ScrollView, ActivityIndicator, Alert } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import dbService from '../../../database';

const DIAS_SEMANA = ['Lunes', 'Martes', 'Miércoles', 'Jueves', 'Viernes'];
const HORAS = ['7:00 - 8:00', '8:00 - 9:00', '9:00 - 10:00', '10:30 - 11:30', '11:30 - 12:30', '1:30 - 2:30'];

export default function HorarioGeneral() {
  const [horario, setHorario] = useState(null);
  const [loading, setLoading] = useState(true);
  const [colorMap, setColorMap] = useState({});
  const [grado, setGrado] = useState('');

  useEffect(() => {
    const loadHorarioData = async () => {
      try {
        const userString = await AsyncStorage.getItem('currentUser');
        if (!userString) {
          throw new Error("No se encontró información del usuario.");
        }
        const currentUser = JSON.parse(userString);
        
        if (!currentUser.grado) {
          setGrado('No asignado');
          setHorario(null);
          return;
        }

        setGrado(currentUser.grado);
        const horarioData = await dbService.getHorarioByGrado(currentUser.grado);
        const colors = await dbService.getMateriaColores();

        setColorMap(colors);
        setHorario(horarioData);

      } catch (error) {
        Alert.alert("Error", "No se pudo cargar el horario. " + error.message);
      } finally {
        setLoading(false);
      }
    };

    loadHorarioData();
  }, []);

  if (loading) {
    return <ActivityIndicator size="large" color="#007bff" style={styles.loader} />;
  }

  return (
    <ScrollView style={styles.container}>
      <Text style={styles.title}>Horario General</Text>
      <Text style={styles.subtitle}>Grado: {grado}</Text>

      {horario ? (
        <ScrollView horizontal>
          <View style={styles.table}>
            {/* Encabezado */}
            <View style={styles.row}>
              <Text style={[styles.cell, styles.header, styles.hourCell]}>Hora</Text>
              {DIAS_SEMANA.map(dia => <Text key={dia} style={[styles.cell, styles.header]}>{dia}</Text>)}
            </View>
            {/* Filas de Horas */}
            {HORAS.map(hora => (
              <View key={hora} style={styles.row}>
                <Text style={[styles.cell, styles.hourCell]}>{hora}</Text>
                {DIAS_SEMANA.map(dia => (
                  <Text key={dia} style={[styles.cell, { backgroundColor: colorMap[horario[hora]?.[dia]?.toLowerCase()] || '#fff' }]}>{horario[hora]?.[dia] || ''}</Text>
                ))}
              </View>
            ))}
          </View>
        </ScrollView>
      ) : (
        <View style={styles.emptyCard}>
          <Text style={styles.emptyText}>No hay un horario disponible para tu grado en este momento.</Text>
        </View>
      )}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 15,
    backgroundColor: '#f4f7f6',
  },
  loader: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  title: { fontSize: 26, fontWeight: 'bold', textAlign: 'center', marginBottom: 5, color: '#333' },
  subtitle: { fontSize: 18, textAlign: 'center', marginBottom: 20, color: '#555' },
  table: {
    flexDirection: 'column',
  },
  row: {
    flexDirection: 'row',
  },
  cell: {
    width: 120,
    padding: 10,
    borderWidth: 1,
    borderColor: '#ddd',
    textAlign: 'center',
    minHeight: 50,
    textAlignVertical: 'center'
  },
  header: {
    fontWeight: 'bold',
    backgroundColor: '#e9ecef',
  },
  hourCell: {
    width: 100,
    fontWeight: 'bold'
  },
  emptyCard: {
    backgroundColor: '#fff',
    borderRadius: 10,
    padding: 20,
    elevation: 3,
  },
  emptyText: { fontSize: 16, color: '#888', textAlign: 'center', fontStyle: 'italic' },
});