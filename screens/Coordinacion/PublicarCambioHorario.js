import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, TextInput, Button, Alert, TouchableOpacity, Platform } from 'react-native';
import { Picker } from '@react-native-picker/picker';
import DateTimePicker from '@react-native-community/datetimepicker';
import dbService from '../../database';

const GRUPOS_FIJOS = [
  'Todos',
  'Sexto-1', 'Sexto-2',
  'Séptimo-1', 'Séptimo-2',
  'Octavo-1', 'Octavo-2',
  'Noveno-1', 'Noveno-2',
  'Décimo-1', 'Décimo-2',
  'Once-1', 'Once-2'
];

export default function PublicarCambioHorario() {
  const [selectedGrado, setSelectedGrado] = useState(GRUPOS_FIJOS[0]);
  const [descripcion, setDescripcion] = useState('');
  const [fecha, setFecha] = useState(new Date());
  const [showDatePicker, setShowDatePicker] = useState(false);

  useEffect(() => {
    // La lista de grados ahora es estática, no se necesita fetch.
    // Se establece el valor por defecto en el estado inicial.
  }, []);

  const handlePublicar = async () => {
    if (!selectedGrado || !descripcion) {
      Alert.alert('Error', 'Por favor, complete todos los campos.');
      return;
    }

    const formatDate = (d) => `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`;

    try {
      await dbService.addCambioHorario(formatDate(fecha), selectedGrado, descripcion);
      Alert.alert('Éxito', 'El cambio de horario ha sido publicado.');
      setDescripcion('');
    } catch (error) {
      Alert.alert('Error', 'No se pudo publicar el cambio.');
    }
  };

  const onDateChange = (event, selectedDate) => {
    const currentDate = selectedDate || fecha;
    setShowDatePicker(Platform.OS === 'ios');
    setFecha(currentDate);
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Publicar Cambio de Horario</Text>

      <Text style={styles.label}>Fecha del Cambio:</Text>
      <TouchableOpacity onPress={() => setShowDatePicker(true)} style={styles.dateTouchable}>
        <Text style={styles.dateText}>{fecha.toLocaleDateString()}</Text>
      </TouchableOpacity>

      {showDatePicker && (
        <DateTimePicker
          value={fecha}
          mode="date"
          display="default"
          onChange={onDateChange}
        />
      )}

      <Text style={styles.label}>Grado Afectado:</Text>
      <View style={styles.pickerContainer}>
        <Picker
          selectedValue={selectedGrado}
          onValueChange={(itemValue) => setSelectedGrado(itemValue)}
        >
          {GRUPOS_FIJOS.map(grupo => <Picker.Item key={grupo} label={grupo} value={grupo} />)}
        </Picker>
      </View>

      <Text style={styles.label}>Descripción del Cambio:</Text>
      <TextInput
        style={styles.input}
        multiline
        placeholder="Ej: La clase de matemáticas se cancela. Salida a las 12:00 PM."
        value={descripcion}
        onChangeText={setDescripcion}
      />

      <Button title="Publicar Anuncio" onPress={handlePublicar} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 20, backgroundColor: '#f8f9fa' },
  title: { fontSize: 24, fontWeight: 'bold', marginBottom: 20, textAlign: 'center' },
  label: { fontSize: 16, fontWeight: '600', marginBottom: 5, marginTop: 10 },
  pickerContainer: {
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 8,
    backgroundColor: '#fff',
  },
  input: {
    backgroundColor: '#fff',
    borderWidth: 1,
    borderColor: '#ced4da',
    borderRadius: 8,
    padding: 15,
    fontSize: 16,
    minHeight: 120,
    textAlignVertical: 'top',
    marginBottom: 20,
  },
  dateTouchable: {
    backgroundColor: '#fff',
    borderWidth: 1,
    borderColor: '#ced4da',
    borderRadius: 8,
    padding: 15,
    marginBottom: 10,
  },
  dateText: {
    fontSize: 16,
    textAlign: 'center',
  },
});