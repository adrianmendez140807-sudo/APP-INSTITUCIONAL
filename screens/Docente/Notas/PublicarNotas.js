// screens/Docente/Notas/PublicarNotas.js
import React, { useState, useEffect } from 'react';
import { 
  View, 
  Text, 
  FlatList, 
  TextInput, 
  TouchableOpacity, 
  StyleSheet, 
  Alert,
  ScrollView 
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import AsyncStorage from '@react-native-async-storage/async-storage';
import dbService from '../../../database';

export default function PublicarNotas({ navigation }) {
  const [students, setStudents] = useState([]);
  const [selectedStudent, setSelectedStudent] = useState(null);
  const [notes, setNotes] = useState([]);
  const [currentUser, setCurrentUser] = useState(null);
  const [searchText, setSearchText] = useState('');

  // Materias disponibles
  const materias = [
    'Matemáticas', 'Español', 'Inglés', 'Ciencias Naturales',
    'Ciencias Sociales', 'Educación Física', 'Artística', 'Ética',
    'Tecnología', 'Religión'
  ];

  useEffect(() => {
    loadCurrentUser();
    loadStudents();
  }, []);

  useEffect(() => {
    if (selectedStudent) {
      loadStudentNotes();
    }
  }, [selectedStudent]);

  const loadCurrentUser = async () => {
    const user = await AsyncStorage.getItem('currentUser');
    setCurrentUser(JSON.parse(user));
  };

  const loadStudents = async () => {
    try {
      const allUsers = await dbService.getUsers();
      const studentsList = allUsers.filter(u => u.role === 'estudiante');
      setStudents(studentsList);
    } catch (error) {
      Alert.alert('Error', 'No se pudieron cargar los estudiantes');
    }
  };

  const loadStudentNotes = async () => {
    try {
      const studentNotes = await dbService.getNotesByStudent(selectedStudent.id);
      
      // Crear estructura de notas por materia y periodo
      const notesStructure = {};
      materias.forEach(materia => {
        notesStructure[materia] = {
          periodo1: studentNotes.find(n => n.materia === materia && n.periodo === 1) || null,
          periodo2: studentNotes.find(n => n.materia === materia && n.periodo === 2) || null,
          periodo3: studentNotes.find(n => n.materia === materia && n.periodo === 3) || null,
          periodo4: studentNotes.find(n => n.materia === materia && n.periodo === 4) || null,
        };
      });
      
      setNotes(notesStructure);
    } catch (error) {
      Alert.alert('Error', 'No se pudieron cargar las notas');
    }
  };

  const handleSaveNote = async (materia, periodo, valor, descripcion = '') => {
    if (!valor || isNaN(valor) || valor < 0 || valor > 5) {
      Alert.alert('Error', 'Ingrese una nota válida entre 0 y 5');
      return;
    }

    try {
      const existingNote = notes[materia][`periodo${periodo}`];
      
      const noteData = {
        id: existingNote?.id,
        student_id: selectedStudent.id,
        materia,
        periodo,
        nota: parseFloat(valor),
        descripcion
      };

      await dbService.addOrUpdateNote(noteData);
      Alert.alert('Éxito', 'Nota guardada correctamente');
      loadStudentNotes();
    } catch (error) {
      Alert.alert('Error', 'No se pudo guardar la nota');
    }
  };

  const filteredStudents = students.filter(s => 
    s.name.toLowerCase().includes(searchText.toLowerCase()) ||
    s.documentNumber.includes(searchText)
  );

  if (!selectedStudent) {
    return (
      <View style={styles.container}>
        <Text style={styles.title}>Seleccionar Estudiante</Text>
        
        <View style={styles.searchContainer}>
          <Ionicons name="search" size={20} color="#999" />
          <TextInput
            style={styles.searchInput}
            placeholder="Buscar por nombre o documento..."
            value={searchText}
            onChangeText={setSearchText}
          />
        </View>

        <FlatList
          data={filteredStudents}
          keyExtractor={item => item.id.toString()}
          renderItem={({ item }) => (
            <TouchableOpacity 
              style={styles.studentItem}
              onPress={() => setSelectedStudent(item)}
            >
              <Ionicons name="person-circle" size={40} color="#007bff" />
              <View style={styles.studentInfo}>
                <Text style={styles.studentName}>{item.name}</Text>
                <Text style={styles.studentDoc}>Doc: {item.documentNumber}</Text>
                {item.grado && <Text style={styles.studentGrade}>Grado: {item.grado}</Text>}
              </View>
              <Ionicons name="chevron-forward" size={24} color="#999" />
            </TouchableOpacity>
          )}
        />
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => setSelectedStudent(null)}>
          <Ionicons name="arrow-back" size={28} color="#007bff" />
        </TouchableOpacity>
        <View style={styles.headerInfo}>
          <Text style={styles.headerTitle}>{selectedStudent.name}</Text>
          <Text style={styles.headerSubtitle}>Gestión de Notas</Text>
        </View>
      </View>

      <ScrollView>
        {materias.map(materia => (
          <MateriaCard
            key={materia}
            materia={materia}
            notes={notes[materia]}
            onSave={handleSaveNote}
          />
        ))}
      </ScrollView>
    </View>
  );
}

const MateriaCard = ({ materia, notes, onSave }) => {
  const [expanded, setExpanded] = useState(false);
  const [tempNotes, setTempNotes] = useState({
    1: notes?.periodo1?.nota?.toString() || '',
    2: notes?.periodo2?.nota?.toString() || '',
    3: notes?.periodo3?.nota?.toString() || '',
    4: notes?.periodo4?.nota?.toString() || '',
  });

  const calcularPromedio = () => {
    const valores = Object.values(tempNotes).filter(v => v && !isNaN(v)).map(Number);
    if (valores.length === 0) return 0;
    return (valores.reduce((a, b) => a + b, 0) / valores.length).toFixed(2);
  };

  return (
    <View style={styles.materiaCard}>
      <TouchableOpacity 
        style={styles.materiaHeader}
        onPress={() => setExpanded(!expanded)}
      >
        <Text style={styles.materiaTitle}>{materia}</Text>
        <View style={styles.materiaHeaderRight}>
          <Text style={styles.promedio}>Promedio: {calcularPromedio()}</Text>
          <Ionicons 
            name={expanded ? "chevron-up" : "chevron-down"} 
            size={24} 
            color="#007bff" 
          />
        </View>
      </TouchableOpacity>

      {expanded && (
        <View style={styles.periodosContainer}>
          {[1, 2, 3, 4].map(periodo => (
            <View key={periodo} style={styles.periodoRow}>
              <Text style={styles.periodoLabel}>Periodo {periodo}</Text>
              <View style={styles.periodoInput}>
                <TextInput
                  style={styles.notaInput}
                  placeholder="0.0"
                  keyboardType="decimal-pad"
                  value={tempNotes[periodo]}
                  onChangeText={(text) => setTempNotes({...tempNotes, [periodo]: text})}
                  maxLength={3}
                />
                <TouchableOpacity 
                  style={styles.saveButton}
                  onPress={() => onSave(materia, periodo, tempNotes[periodo])}
                >
                  <Ionicons name="checkmark" size={20} color="#fff" />
                </TouchableOpacity>
              </View>
            </View>
          ))}
        </View>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#f8f9fa' },
  title: { fontSize: 24, fontWeight: 'bold', padding: 20, color: '#343a40' },
  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#fff',
    marginHorizontal: 20,
    marginBottom: 15,
    paddingHorizontal: 15,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: '#e9ecef',
  },
  searchInput: { flex: 1, height: 45, marginLeft: 10, fontSize: 16 },
  studentItem: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#fff',
    marginHorizontal: 20,
    marginBottom: 10,
    padding: 15,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: '#e9ecef',
  },
  studentInfo: { flex: 1, marginLeft: 15 },
  studentName: { fontSize: 16, fontWeight: '600', color: '#212529' },
  studentDoc: { fontSize: 14, color: '#6c757d', marginTop: 4 },
  studentGrade: { fontSize: 13, color: '#007bff', marginTop: 2 },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#fff',
    padding: 15,
    borderBottomWidth: 1,
    borderBottomColor: '#e9ecef',
  },
  headerInfo: { flex: 1, marginLeft: 15 },
  headerTitle: { fontSize: 20, fontWeight: 'bold', color: '#212529' },
  headerSubtitle: { fontSize: 14, color: '#6c757d', marginTop: 2 },
  materiaCard: {
    backgroundColor: '#fff',
    marginHorizontal: 15,
    marginVertical: 8,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: '#e9ecef',
    overflow: 'hidden',
  },
  materiaHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 15,
    backgroundColor: '#f8f9fa',
  },
  materiaTitle: { fontSize: 16, fontWeight: '600', color: '#212529' },
  materiaHeaderRight: { flexDirection: 'row', alignItems: 'center' },
  promedio: { fontSize: 14, fontWeight: '500', color: '#007bff', marginRight: 10 },
  periodosContainer: { padding: 15 },
  periodoRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  periodoLabel: { fontSize: 15, fontWeight: '500', color: '#495057', flex: 1 },
  periodoInput: { flexDirection: 'row', alignItems: 'center' },
  notaInput: {
    borderWidth: 1,
    borderColor: '#ced4da',
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 8,
    width: 70,
    fontSize: 16,
    textAlign: 'center',
    marginRight: 10,
  },
  saveButton: {
    backgroundColor: '#28a745',
    width: 36,
    height: 36,
    borderRadius: 18,
    justifyContent: 'center',
    alignItems: 'center',
  },
});