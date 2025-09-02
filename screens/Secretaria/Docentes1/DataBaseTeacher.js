import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, ScrollView, TextInput, TouchableOpacity, Alert } from 'react-native';
import dbService from '../../../database';

export default function DataBaseTeacher({ route, navigation }) {
  const { teacher } = route.params || {};
  const [teacherData, setTeacherData] = useState(null);

  useEffect(() => {
    if (teacher) {
      // Inicializamos el estado con los datos del docente,
      // y preparamos los campos nuevos con valores por defecto.
      setTeacherData({
        ...teacher,
        telefono: teacher.telefono || '',
        direccion: teacher.direccion || '',
        fechaNacimiento: teacher.fechaNacimiento || '',
        fechaIngreso: teacher.fechaIngreso || '',
        tituloAcademico: teacher.tituloAcademico || '',
        materias: teacher.materias || '',
        grados: teacher.grados || '',
        directorDeGrupo: teacher.directorDeGrupo || '',
      });
    }
  }, [teacher]);

  const handleInputChange = (field, value) => {
    setTeacherData(prev => ({ ...prev, [field]: value }));
  };

  const handleSave = async () => {
    if (!teacherData) return;
    try {
      await dbService.updateUser(teacherData);
      Alert.alert('Éxito', 'Los datos del docente han sido actualizados.', [
        { text: 'OK', onPress: () => navigation.goBack() }
      ]);
    } catch (error) {
      console.error("Error al actualizar docente:", error);
      Alert.alert("Error", "No se pudieron guardar los cambios.");
    }
  };

  if (!teacherData) {
    return (
      <View style={styles.container}>
        <Text style={styles.title}>No se seleccionó ningún docente.</Text>
      </View>
    );
  }
  
  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.contentContainer}>
      <Text style={styles.title}>Hoja de Vida de {teacherData.name}</Text>
      
      <InputGroup label="Nombre Completo" value={teacherData.name} onChangeText={(val) => handleInputChange('name', val)} />
      <InputGroup label="Número de Documento" value={teacherData.documentNumber} onChangeText={(val) => handleInputChange('documentNumber', val)} keyboardType="numeric" />
      <InputGroup label="Correo Electrónico" value={teacherData.email} onChangeText={(val) => handleInputChange('email', val)} keyboardType="email-address" />
      <InputGroup label="Teléfono" value={teacherData.telefono} onChangeText={(val) => handleInputChange('telefono', val)} keyboardType="phone-pad" placeholder="Ej: 3001234567" />
      <InputGroup label="Dirección" value={teacherData.direccion} onChangeText={(val) => handleInputChange('direccion', val)} placeholder="Ej: Calle 123 # 45-67" />
      <InputGroup label="Fecha de Nacimiento" value={teacherData.fechaNacimiento} onChangeText={(val) => handleInputChange('fechaNacimiento', val)} placeholder="AAAA-MM-DD" />
      <InputGroup label="Fecha de Ingreso" value={teacherData.fechaIngreso} onChangeText={(val) => handleInputChange('fechaIngreso', val)} placeholder="AAAA-MM-DD" />
      <InputGroup label="Título Académico" value={teacherData.tituloAcademico} onChangeText={(val) => handleInputChange('tituloAcademico', val)} placeholder="Ej: Licenciado en Matemáticas" />
      <InputGroup label="Materias que dicta" value={teacherData.materias} onChangeText={(val) => handleInputChange('materias', val)} placeholder="Ej: Matemáticas, Física" />
      <InputGroup label="Grados que enseña" value={teacherData.grados} onChangeText={(val) => handleInputChange('grados', val)} placeholder="Ej: 9, 10, 11" />
      <InputGroup label="Director de Grupo" value={teacherData.directorDeGrupo} onChangeText={(val) => handleInputChange('directorDeGrupo', val)} placeholder="Ej: 10-A" />
      
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
  title: { fontSize: 24, fontWeight: 'bold', marginBottom: 25, color: '#343a40', textAlign: 'center' },
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
