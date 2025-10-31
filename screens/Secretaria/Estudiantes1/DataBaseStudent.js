import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, ScrollView, TextInput, TouchableOpacity, Alert, ActivityIndicator, FlatList } from 'react-native';
import { Picker } from '@react-native-picker/picker';
import dbService from '../../../database';

const STATUS_COLORS = {
  'Presente': 'green',
  'Ausente': 'red',
  'Tardanza': 'orange',
  'Excusa': '#007bff',
};

const GRUPOS_FIJOS = [
  'Sexto-1', 'Sexto-2',
  'Séptimo-1', 'Séptimo-2',
  'Octavo-1', 'Octavo-2',
  'Noveno-1', 'Noveno-2',
  'Décimo-1', 'Décimo-2',
  'Once-1', 'Once-2'
];

export default function DataBaseStudent({ route, navigation }) {
  const { studentId } = route.params || {};
  const [studentData, setStudentData] = useState(null);
  const [attendance, setAttendance] = useState([]);
  const [filter, setFilter] = useState('last30days');
  const [loading, setLoading] = useState(true);
  const [loadingAttendance, setLoadingAttendance] = useState(false);
  const [newPassword, setNewPassword] = useState('');

  useEffect(() => {
    const loadInitialData = async () => {
      if (!studentId) {
        setLoading(false);
        return;
      }
      try {
        const student = await dbService.getUserById(studentId);
        if (student) {
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
      } catch (error) {
        console.error("Error al cargar datos del estudiante:", error);
        Alert.alert("Error", "No se pudieron cargar los datos del estudiante.");
      } finally {
        setLoading(false);
      }
    };
    loadInitialData();
  }, [studentId]);

  useEffect(() => {
    const loadAttendanceData = async () => {
      if (!studentId) return;

      setLoadingAttendance(true);
      try {
        const student = await dbService.getUserById(studentId);
        if (student) {
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

        // Cargar reporte de asistencia según el filtro
        let startDate = new Date();
        const endDate = new Date();

        switch (filter) {
          case 'last7days':
            startDate.setDate(endDate.getDate() - 7);
            break;
          case 'currentMonth':
            startDate = new Date(endDate.getFullYear(), endDate.getMonth(), 1);
            break;
          case 'last6months':
            startDate.setMonth(endDate.getMonth() - 6);
            break;
          case 'currentYear':
            startDate = new Date(endDate.getFullYear(), 0, 1);
            break;
          case 'all':
            startDate = new Date(2000, 0, 1); // Una fecha lejana para obtener todo
            break;
          case 'last30days':
          default:
            startDate.setDate(endDate.getDate() - 30);
            break;
        }

        const formatDate = (d) => `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`;

        const attendanceData = await dbService.getAttendanceReport(
          studentId,
          formatDate(startDate),
          formatDate(endDate),
        );
        setAttendance(attendanceData);
      } catch (error) {
        console.error("Error al cargar el reporte de asistencia:", error);
        Alert.alert("Error", "No se pudo cargar el reporte de asistencia.");
      } finally {
        setLoadingAttendance(false);
      }
    };
    loadAttendanceData();
  }, [studentId, filter]);

  const handleInputChange = (field, value) => {
    setStudentData(prev => ({ ...prev, [field]: value }));
  };

  const handleSave = async () => {
    if (!studentData) return;
    try {
      // Usamos la misma función updateUser, que ahora está corregida
      await dbService.updateUser(studentData);
      Alert.alert('Éxito', 'Los datos del estudiante han sido actualizados.', [
        { text: 'OK', onPress: () => navigation.goBack() }
      ]);
    } catch (error) {
      console.error("Error al actualizar estudiante:", error);
      Alert.alert("Error", "No se pudieron guardar los cambios.");
    }
  };

  const handlePasswordChange = () => {
    if (!newPassword || newPassword.length < 6) {
      Alert.alert('Contraseña Inválida', 'La nueva contraseña debe tener al menos 6 caracteres.');
      return;
    }

    Alert.alert(
      'Confirmar Cambio de Contraseña',
      `¿Estás seguro de que quieres cambiar la contraseña para ${studentData.name}?`,
      [
        { text: 'Cancelar', style: 'cancel' },
        {
          text: 'Confirmar',
          onPress: async () => {
            await dbService.updateUserPassword(studentId, newPassword);
            Alert.alert('Éxito', 'La contraseña ha sido actualizada.');
            setNewPassword('');
          },
        },
      ]
    );
  };

  if (loading) {
    return <ActivityIndicator size="large" style={styles.loader} />;
  }

  if (!studentData) {
    return (
      <View style={styles.container}>
        <Text style={styles.title}>No se seleccionó ningún estudiante.</Text>
      </View>
    );
  }
  
  const renderAttendanceItem = ({ item }) => (
    <View style={styles.attendanceItem}>
      <Text>{item.fecha}</Text>
      <Text style={{ color: STATUS_COLORS[item.status], fontWeight: 'bold' }}>{item.status}</Text>
    </View>
  );

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
      <Text style={styles.label}>Grupo:</Text>
      <View style={styles.pickerContainer}>
        <Picker
          selectedValue={studentData.grado}
          onValueChange={(itemValue) => handleInputChange('grado', itemValue)}
        >
          {GRUPOS_FIJOS.map(g => <Picker.Item key={g} label={g} value={g} />)}
        </Picker>
      </View>
      <InputGroup label="Jornada" value={studentData.jornada} onChangeText={(val) => handleInputChange('jornada', val)} placeholder="Ej: Mañana, Tarde" />
      <InputGroup label="Estado" value={studentData.estado} onChangeText={(val) => handleInputChange('estado', val)} placeholder="Ej: Activo, Retirado" />

      <TouchableOpacity style={styles.saveButton} onPress={handleSave}>
        <Text style={styles.saveButtonText}>Guardar Cambios</Text>
      </TouchableOpacity>

      {/* SECCIÓN DE CAMBIO DE CONTRASEÑA */}
      <View style={styles.securityContainer}>
        <Text style={styles.sectionTitle}>Seguridad y Contraseña</Text>
        <InputGroup
          label="Nueva Contraseña"
          value={newPassword}
          onChangeText={setNewPassword}
          placeholder="Mínimo 6 caracteres"
          secureTextEntry
        />
        <TouchableOpacity style={styles.passwordButton} onPress={handlePasswordChange}>
          <Text style={styles.saveButtonText}>Cambiar Contraseña</Text>
        </TouchableOpacity>
      </View>

      {/* SECCIÓN DE REPORTE DE ASISTENCIA */}
      <View style={styles.attendanceContainer}>
        <Text style={styles.sectionTitle}>Reporte de Asistencia</Text>
        
        <View style={styles.pickerContainer}>
          <Picker
            selectedValue={filter}
            onValueChange={(itemValue) => setFilter(itemValue)}
            style={styles.picker}
          >
            <Picker.Item label="Últimos 30 días" value="last30days" />
            <Picker.Item label="Últimos 7 días" value="last7days" />
            <Picker.Item label="Mes Actual" value="currentMonth" />
            <Picker.Item label="Últimos 6 meses" value="last6months" />
            <Picker.Item label="Este Año" value="currentYear" />
            <Picker.Item label="Todo el historial" value="all" />
          </Picker>
        </View>

        {loadingAttendance ? (
          <ActivityIndicator size="small" color="#007bff" style={{ marginVertical: 20 }} />
        ) : (
          <FlatList
            data={attendance}
            renderItem={renderAttendanceItem}
            keyExtractor={(item) => item.id.toString()}
            ListEmptyComponent={<Text style={styles.emptyText}>No hay registros de asistencia en este período.</Text>}
            scrollEnabled={false} // Para que el scroll principal maneje todo
          />
        )}
      </View>
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
  loader: { flex: 1, justifyContent: 'center', alignItems: 'center' },
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
  securityContainer: { marginTop: 20 },
  passwordButton: { backgroundColor: '#dc3545', padding: 15, borderRadius: 8, alignItems: 'center', marginTop: 10 },
  attendanceContainer: { marginTop: 20 },
  attendanceItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#f0f0f0',
    backgroundColor: '#fff',
    paddingHorizontal: 10,
  },
  pickerContainer: { borderWidth: 1, borderColor: '#ced4da', borderRadius: 8, marginBottom: 15, backgroundColor: '#fff' },
  picker: { height: 50, width: '100%' },
  emptyText: { textAlign: 'center', color: '#888', fontStyle: 'italic', marginTop: 10, padding: 10 },
});
