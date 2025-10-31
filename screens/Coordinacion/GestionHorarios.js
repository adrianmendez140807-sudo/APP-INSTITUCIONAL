import React, { useState, useEffect, useCallback } from 'react';
import { View, Text, StyleSheet, ScrollView, TextInput, Button, Alert, ActivityIndicator } from 'react-native';
import { Picker } from '@react-native-picker/picker';
import dbService from '../../database';

const DIAS_SEMANA = ['Lunes', 'Martes', 'Miércoles', 'Jueves', 'Viernes'];
const HORAS = ['7:00 - 8:00', '8:00 - 9:00', '9:00 - 10:00', '10:30 - 11:30', '11:30 - 12:30', '1:30 - 2:30'];
const GRUPOS_FIJOS = [
  'Sexto-1', 'Sexto-2',
  'Séptimo-1', 'Séptimo-2',
  'Octavo-1', 'Octavo-2',
  'Noveno-1', 'Noveno-2',
  'Décimo-1', 'Décimo-2',
  'Once-1', 'Once-2'
];

export default function GestionHorarios() {
  const [selectedGrado, setSelectedGrado] = useState(GRUPOS_FIJOS[0]);
  const [horario, setHorario] = useState(null);
  const [loading, setLoading] = useState(true);
  const [colorMap, setColorMap] = useState({});

  // Función para inicializar un horario vacío
  const initializeHorario = () => {
    const nuevoHorario = {};
    HORAS.forEach(hora => {
      nuevoHorario[hora] = {};
      DIAS_SEMANA.forEach(dia => {
        nuevoHorario[hora][dia] = '';
      });
    });
    return nuevoHorario;
  };

  // Cargar el horario del grado seleccionado
  const loadHorario = useCallback(async () => {
    if (!selectedGrado) return;
    setLoading(true);
    try {
      const colors = await dbService.getMateriaColores();
      setColorMap(colors);

      const horarioData = await dbService.getHorarioByGrado(selectedGrado);
      // Si no hay datos o el formato es antiguo, inicializa uno nuevo
      if (horarioData && typeof horarioData === 'object' && !Array.isArray(horarioData)) {
        setHorario(horarioData);
      } else {
        setHorario(initializeHorario());
      }
    } catch (error) {
      Alert.alert('Error', 'No se pudo cargar el horario.');
    } finally {
      setLoading(false);
    }
  }, [selectedGrado]);

  useEffect(() => {
    loadHorario();
  }, [loadHorario]);

  const handleInputChange = (hora, dia, text) => {
    setHorario(prev => {
      const newHorario = { ...prev };
      if (!newHorario[hora]) newHorario[hora] = {};
      newHorario[hora][dia] = text;
      return newHorario;
    });
  };

  const handleSaveChanges = async () => {
    if (!selectedGrado || !horario) return;
    setLoading(true);
    try {
      await dbService.addOrUpdateHorario(selectedGrado, horario);
      Alert.alert('Éxito', `Horario para ${selectedGrado} guardado correctamente.`);
    } catch (error) {
      Alert.alert('Error', 'No se pudo guardar el horario.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <ScrollView style={styles.container}>
      <Text style={styles.title}>Gestión de Horarios</Text>

      <Text style={styles.label}>Seleccionar Grado:</Text>
      <View style={styles.pickerContainer}>
        <Picker
          selectedValue={selectedGrado}
          onValueChange={(itemValue) => setSelectedGrado(itemValue)}
          enabled={!loading}
        >
          {GRUPOS_FIJOS.map(grupo => <Picker.Item key={grupo} label={grupo} value={grupo} />)}
        </Picker>
      </View>

      {loading ? (
        <ActivityIndicator size="large" color="#007bff" />
      ) : horario ? (
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
                  <TextInput
                    key={dia}
                    style={[styles.cellInput, { backgroundColor: colorMap[horario[hora]?.[dia]?.toLowerCase()] || '#fff' }]}
                    value={horario[hora]?.[dia] || ''}
                    onChangeText={(text) => handleInputChange(hora, dia, text.trim())}
                    placeholder="Materia"
                  />
                ))}
              </View>
            ))}
            <View style={{ marginTop: 20 }}>
              <Button title="Guardar Cambios" onPress={handleSaveChanges} disabled={loading} />
            </View>
          </View>
        </ScrollView>
      ) : (
        <Text>Seleccione un grado para ver o editar el horario.</Text>
      )}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 20, backgroundColor: '#f8f9fa' },
  title: { fontSize: 24, fontWeight: 'bold', marginBottom: 20, textAlign: 'center' },
  pickerContainer: {
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 8,
    marginBottom: 20,
    backgroundColor: '#fff',
  },
  label: { fontSize: 16, fontWeight: '600', marginBottom: 5 },
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
  },
  cellInput: {
    width: 120,
    padding: 10,
    borderWidth: 1,
    borderColor: '#ced4da',
    textAlign: 'center',
  },
  header: {
    fontWeight: 'bold',
    backgroundColor: '#e9ecef',
  },
  hourCell: { width: 100, fontWeight: 'bold' },
});