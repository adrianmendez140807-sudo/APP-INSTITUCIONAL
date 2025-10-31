import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, Button, FlatList, ActivityIndicator, Alert, TouchableOpacity, Platform } from 'react-native';
import { Picker } from '@react-native-picker/picker';
import DateTimePicker from '@react-native-community/datetimepicker';
import dbService from '../../../database/index';

// Definimos los estados de asistencia y sus colores para fácil manejo
const ATTENDANCE_STATUSES = ['Presente', 'Ausente', 'Tardanza', 'Excusa'];
const STATUS_COLORS = {
  'Presente': 'green',
  'Ausente': 'red',
  'Tardanza': 'orange',
  'Excusa': '#007bff', // Un azul para la excusa
};

export default function ReportesAsistencias() {
  const [students, setStudents] = useState([]);
  const [selectedStudent, setSelectedStudent] = useState(null);
  const [startDate, setStartDate] = useState(new Date(new Date().setDate(1))); // Default to start of month
  const [endDate, setEndDate] = useState(new Date()); // Default to today
  const [reportData, setReportData] = useState([]);
  const [hasChanges, setHasChanges] = useState(false);
  const [loading, setLoading] = useState(false);
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [datePickerTarget, setDatePickerTarget] = useState('start'); // 'start' or 'end'

  useEffect(() => {
    const loadStudents = async () => {
      const allUsers = await dbService.getUsers();
      const studentUsers = allUsers.filter(user => user.role === 'estudiante');
      setStudents(studentUsers);
      if (studentUsers.length > 0) {
        setSelectedStudent(studentUsers[0].id);
      }
    };
    loadStudents();
  }, []);

  const handleGenerateReport = async () => {
    if (!selectedStudent) {
      Alert.alert("Error", "Por favor, seleccione un estudiante.");
      return;
    }
    setLoading(true);
    setReportData([]);
    setHasChanges(false);

    // Función para formatear la fecha a YYYY-MM-DD para consistencia
    const formatDate = (date) => {
      const d = new Date(date);
      const year = d.getFullYear();
      const month = String(d.getMonth() + 1).padStart(2, '0');
      const day = String(d.getDate()).padStart(2, '0');
      return `${year}-${month}-${day}`;
    };

    try {
      const dbRecords = await dbService.getAttendanceReport(selectedStudent, formatDate(startDate), formatDate(endDate));
      const dbDates = dbRecords.map(r => r.fecha);

      const fullReport = [];
      let currentDate = new Date(startDate);

      while (currentDate <= endDate) {
        const dateString = formatDate(currentDate);
        const existingRecord = dbRecords.find(r => r.fecha === dateString);

        if (existingRecord) {
          fullReport.push({ ...existingRecord, date: existingRecord.fecha }); // Usar el registro de la BD
        } else {
          // Si no hay registro, se crea uno por defecto para mostrar en la UI
          fullReport.push({
            id: null, // No tiene ID de BD todavía
            student_id: parseInt(selectedStudent, 10), // Asegurarse de que el ID del estudiante esté presente
            date: dateString,
            status: 'Presente', // Estado por defecto para días sin registro
          });
        }
        currentDate.setDate(currentDate.getDate() + 1);
      }

      setReportData(fullReport);
    } catch (error) {
      Alert.alert("Error", "No se pudo cargar el reporte de asistencia.");
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const renderReportItem = ({ item }) => (
    <TouchableOpacity style={styles.reportItem} onPress={() => handleStatusChange(item.date)}>
      <Text style={styles.itemDate}>{item.date}</Text>
      <Text style={[styles.itemStatus, { color: STATUS_COLORS[item.status] || '#333' }]}>
        {item.status}
      </Text>
    </TouchableOpacity>
  );

  const handleStatusChange = (itemDate) => {
    setReportData(currentData =>
      currentData.map(item => {
        if (item.date === itemDate) {
          const currentIndex = ATTENDANCE_STATUSES.indexOf(item.status);
          const nextIndex = (currentIndex + 1) % ATTENDANCE_STATUSES.length;
          const newStatus = ATTENDANCE_STATUSES[nextIndex];
          return { ...item, status: newStatus };
        }
        return item;
      })
    );
    setHasChanges(true); // Marcar que hay cambios sin guardar
  };

  const handleSaveChanges = async () => {
    setLoading(true);
    try {
      // Usamos Promise.all para que todas las operaciones de guardado se ejecuten en paralelo
      await Promise.all(reportData.map(item => {
        const record = {
          student_id: item.student_id,
          fecha: item.date,
          status: item.status,
        };
        return dbService.addOrUpdateAttendance(record);
      }));

      setHasChanges(false);
      Alert.alert("Éxito", "Los cambios en la asistencia han sido guardados.");
      handleGenerateReport(); // Recargar datos para obtener IDs actualizados
    } catch (error) {
      Alert.alert("Error", "No se pudieron guardar los cambios.");
    } finally {
      setLoading(false);
    }
  };

  const onDateChange = (event, selectedDate) => {
    const currentDate = selectedDate || (datePickerTarget === 'start' ? startDate : endDate);
    setShowDatePicker(Platform.OS === 'ios');
    
    if (datePickerTarget === 'start') {
      setStartDate(currentDate);
    } else {
      setEndDate(currentDate);
    }
    // Al cambiar la fecha, limpiamos el reporte actual para evitar confusiones
    setReportData([]);
    setHasChanges(false);
  };

  const showDatepickerFor = (target) => {
    setDatePickerTarget(target);
    setShowDatePicker(true);
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Reporte de Asistencia</Text>

      <View style={styles.filtersContainer}>
        <Text style={styles.label}>Estudiante:</Text>
        <View style={styles.pickerContainer}>
          <Picker
            selectedValue={selectedStudent}
            onValueChange={(itemValue) => setSelectedStudent(itemValue)}
            style={styles.picker}
          >
            {students.map(student => (
              <Picker.Item key={student.id} label={`${student.name}`} value={student.id} />
            ))}
          </Picker>
        </View>

        <Text style={styles.label}>Rango de Fechas:</Text>
        <View style={styles.dateContainer}>
          <TouchableOpacity onPress={() => showDatepickerFor('start')} style={styles.dateTouchable}>
            <Text style={styles.dateText}>Desde: {startDate.toLocaleDateString()}</Text>
          </TouchableOpacity>
          <TouchableOpacity onPress={() => showDatepickerFor('end')} style={styles.dateTouchable}>
            <Text style={styles.dateText}>Hasta: {endDate.toLocaleDateString()}</Text>
          </TouchableOpacity>
        </View>

        {showDatePicker && (
          <DateTimePicker
            testID="dateTimePicker"
            value={datePickerTarget === 'start' ? startDate : endDate}
            mode="date"
            display="default"
            onChange={onDateChange}
          />
        )}
        
        <Button title="Generar Reporte" onPress={handleGenerateReport} disabled={loading} />
      </View>

      {loading ? (
        <ActivityIndicator size="large" color="#0000ff" style={{ marginTop: 20 }} />
      ) : (
        <FlatList
          data={reportData}
          renderItem={renderReportItem}
          keyExtractor={item => item.date} // La fecha es única por estudiante en el reporte
          ListHeaderComponent={reportData.length > 0 ? <Text style={styles.reportHeader}>Resultados (pulsa para editar)</Text> : null}
          ListEmptyComponent={<Text style={styles.emptyText}>No hay datos para mostrar. Genere un nuevo reporte.</Text>}
          style={styles.reportList}
          ListFooterComponent={
            hasChanges && (
              <View style={styles.saveButtonContainer}>
                <Button title="Guardar Cambios" onPress={handleSaveChanges} color="#4CAF50" />
              </View>
            )
          }
        />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 20, backgroundColor: '#f4f7f6' },
  title: { fontSize: 24, fontWeight: 'bold', textAlign: 'center', marginBottom: 20, color: '#333' },
  filtersContainer: { backgroundColor: '#fff', padding: 15, borderRadius: 10, marginBottom: 20, elevation: 2 },
  label: { fontSize: 16, fontWeight: '600', marginBottom: 5, color: '#555' },
  pickerContainer: { borderWidth: 1, borderColor: '#ccc', borderRadius: 5, marginBottom: 15 },
  picker: { height: 50, width: '100%' },
  dateContainer: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: 20 },
  dateTouchable: { backgroundColor: '#e7e7e7', padding: 10, borderRadius: 5, width: '48%' },
  dateText: { textAlign: 'center', fontSize: 16 },
  reportList: { marginTop: 10 },
  reportHeader: { fontSize: 16, fontWeight: 'bold', marginBottom: 10, textAlign: 'center', color: '#666' },
  reportItem: { flexDirection: 'row', justifyContent: 'space-between', padding: 15, borderBottomWidth: 1, borderBottomColor: '#eee', backgroundColor: '#fff', borderRadius: 5, marginBottom: 5 },
  itemDate: { fontSize: 16 },
  itemStatus: { fontSize: 16, fontWeight: 'bold' },
  emptyText: { textAlign: 'center', marginTop: 50, color: '#888' },
  saveButtonContainer: { marginTop: 20, paddingHorizontal: 10 },
});
