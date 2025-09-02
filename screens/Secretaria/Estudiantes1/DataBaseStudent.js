import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, ScrollView, TextInput, TouchableOpacity, Alert } from 'react-native';
import dbService from '../../../database';

export default function DataBaseStudent({ route, navigation }) {
  const { student } = route.params || {};
  const [studentData, setStudentData] = useState(null);

  useEffect(() => {
    if (student) {
      // Inicializamos el estado con los datos del estudiante,
      // y preparamos los campos nuevos con valores por defecto.
      setStudentData({
        ...student,
        telefono: student.telefono || '',
        direccion: student.direccion || '',
        fechaNacimiento: student.fechaNacimiento || '',
        nombreAcudiente: student.nombreAcudiente || '',
        telefonoAcudiente: student.telefonoAcudiente || '',
        emailAcudiente: student.emailAcudiente || '',
        grado: student.grado || '',
        jornada: student.jornada || '',
        estado: student.estado || 'Activo',
      });
    }
  }, [student]);

  const handleInputChange = (field, value) => {
    setStudentData(prev => ({ ...prev, [field]: value }));
  };

  const handleSave = async () => {
    if (!studentData) return;
    try {
      // Usamos la misma función updateUser, ya que es genérica
      await dbService.updateUser(studentData);
      Alert.alert('Éxito', 'Los datos del estudiante han sido actualizados.', [
        { text: 'OK', onPress: () => navigation.goBack() }
      ]);
    } catch (error) {
      console.error("Error al actualizar estudiante:", error);
      Alert.alert("Error", "No se pudieron guardar los cambios.");
    }
  };

  if (!studentData) {
    return (
      <View style={styles.container}>
        <Text style={styles.title}>No se seleccionó ningún estudiante.</Text>
      </View>
    );
  }
  
  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.contentContainer}>
      <Text style={styles.title}>Hoja de Vida de {studentData.name}</Text>
      
      <Text style={styles.sectionTitle}>Datos Personales</Text>
      <InputGroup label="Nombre Completo" value={studentData.name} onChangeText={(val) => handleInputChange('name', val)} />
      <InputGroup label="Número de Documento" value={studentData.documentNumber} onChangeText={(val) => handleInputChange('documentNumber', val)} keyboardType="numeric" />
      <InputGroup label="Correo Electrónico" value={studentData.email} onChangeText={(val) => handleInputChange('email', val)} keyboardType="email-address" />
      <InputGroup label="Teléfono" value={studentData.telefono} onChangeText={(val) => handleInputChange('telefono', val)} keyboardType="phone-pad" placeholder="Ej: 3001234567" />
      <InputGroup label="Dirección" value={studentData.direccion} onChangeText={(val) => handleInputChange('direccion', val)} placeholder="Ej: Calle 123 # 45-67" />
      <InputGroup label="Fecha de Nacimiento" value={studentData.fechaNacimiento} onChangeText={(val) => handleInputChange('fechaNacimiento', val)} placeholder="AAAA-MM-DD" />
      
      <Text style={styles.sectionTitle}>Datos del Acudiente</Text>
      <InputGroup label="Nombre del Acudiente" value={studentData.nombreAcudiente} onChangeText={(val) => handleInputChange('nombreAcudiente', val)} placeholder="Nombre completo" />
      <InputGroup label="Teléfono del Acudiente" value={studentData.telefonoAcudiente} onChangeText={(val) => handleInputChange('telefonoAcudiente', val)} keyboardType="phone-pad" placeholder="Ej: 3001234567" />
      <InputGroup label="Email del Acudiente" value={studentData.emailAcudiente} onChangeText={(val) => handleInputChange('emailAcudiente', val)} keyboardType="email-address" placeholder="correo@ejemplo.com" />
      
      <Text style={styles.sectionTitle}>Información Académica</Text>
      <InputGroup label="Grado" value={studentData.grado} onChangeText={(val) => handleInputChange('grado', val)} placeholder="Ej: 10-A" />
      <InputGroup label="Jornada" value={studentData.jornada} onChangeText={(val) => handleInputChange('jornada', val)} placeholder="Ej: Mañana, Tarde" />
      <InputGroup label="Estado" value={studentData.estado} onChangeText={(val) => handleInputChange('estado', val)} placeholder="Ej: Activo, Retirado" />

      <TouchableOpacity style={styles.saveButton} onPress={handleSave}>
        <Text style={styles.saveButtonText}>Guardar Cambios</Text>
      </TouchableOpacity>
    </ScrollView>
  );
}

// Componente auxiliar para no repetir código
const InputGroup = ({ label, ...props }) => (
  <View style={styles.inputGroup}>
    <Text style={styles.label}>{label}</Text>
    <TextInput style={styles.input} placeholderTextColor="#999" {...props} />
  </View>
);

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#f8f9fa' },
  contentContainer: { padding: 20 },
  title: { fontSize: 24, fontWeight: 'bold', marginBottom: 15, color: '#343a40', textAlign: 'center' },
  sectionTitle: { fontSize: 20, fontWeight: '600', color: '#007bff', marginTop: 15, marginBottom: 15, borderBottomWidth: 1, borderBottomColor: '#007bff', paddingBottom: 5 },
  inputGroup: { marginBottom: 15 },
  label: { fontSize: 16, color: '#495057', marginBottom: 5, fontWeight: '500' },
  input: {
    backgroundColor: '#fff',
    paddingHorizontal: 15,
    paddingVertical: 12,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#ced4da',
    fontSize: 16,
    color: '#212529',
  },
  saveButton: { backgroundColor: '#007bff', padding: 15, borderRadius: 8, alignItems: 'center', marginTop: 20 },
  saveButtonText: { color: '#fff', fontSize: 18, fontWeight: 'bold' },
});