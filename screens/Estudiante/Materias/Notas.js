// screens/Estudiante/Materias/Notas.js
import React, { useState, useEffect } from 'react';
import { 
  View, 
  Text, 
  ScrollView, 
  StyleSheet, 
  ActivityIndicator,
  TouchableOpacity,
  RefreshControl 
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import AsyncStorage from '@react-native-async-storage/async-storage';
import dbService from '../../../database';

export default function Notas({ navigation }) {
  const [currentUser, setCurrentUser] = useState(null);
  const [notes, setNotes] = useState({});
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [selectedPeriod, setSelectedPeriod] = useState('todos');

  const materias = [
    'Matemáticas', 'Español', 'Inglés', 'Ciencias Naturales',
    'Ciencias Sociales', 'Educación Física', 'Artística', 'Ética',
    'Tecnología', 'Religión'
  ];

  useEffect(() => {
    loadUserAndNotes();
  }, []);

  const loadUserAndNotes = async () => {
    try {
      const user = await AsyncStorage.getItem('currentUser');
      if (user) {
        const parsedUser = JSON.parse(user);
        setCurrentUser(parsedUser);
        await loadNotes(parsedUser.id);
      }
    } catch (error) {
      console.error('Error cargando datos:', error);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  const loadNotes = async (studentId) => {
    try {
      const studentNotes = await dbService.getNotesByStudent(studentId);
      
      // Organizar notas por materia
      const notesStructure = {};
      materias.forEach(materia => {
        const materiaNotes = studentNotes.filter(n => n.materia === materia);
        notesStructure[materia] = {
          periodo1: materiaNotes.find(n => n.periodo === 1) || null,
          periodo2: materiaNotes.find(n => n.periodo === 2) || null,
          periodo3: materiaNotes.find(n => n.periodo === 3) || null,
          periodo4: materiaNotes.find(n => n.periodo === 4) || null,
        };
      });
      
      setNotes(notesStructure);
    } catch (error) {
      console.error('Error cargando notas:', error);
    }
  };

  const onRefresh = () => {
    setRefreshing(true);
    loadUserAndNotes();
  };

  const calcularPromedioGeneral = () => {
    let totalNotas = 0;
    let cantidadNotas = 0;

    Object.values(notes).forEach(materia => {
      Object.values(materia).forEach(nota => {
        if (nota && nota.nota) {
          totalNotas += nota.nota;
          cantidadNotas++;
        }
      });
    });

    return cantidadNotas > 0 ? (totalNotas / cantidadNotas).toFixed(2) : '0.00';
  };

  const calcularPromedioMateria = (materiaNotes) => {
    const valores = Object.values(materiaNotes)
      .filter(n => n && n.nota)
      .map(n => n.nota);
    
    if (valores.length === 0) return '0.00';
    return (valores.reduce((a, b) => a + b, 0) / valores.length).toFixed(2);
  };

  const getNotaColor = (nota) => {
    if (!nota) return '#6c757d';
    if (nota >= 4.5) return '#28a745';
    if (nota >= 4.0) return '#20c997';
    if (nota >= 3.5) return '#ffc107';
    if (nota >= 3.0) return '#fd7e14';
    return '#dc3545';
  };

  if (loading) {
    return (
      <View style={styles.centerContainer}>
        <ActivityIndicator size="large" color="#007bff" />
        <Text style={styles.loadingText}>Cargando notas...</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <View style={styles.headerCard}>
        <Text style={styles.headerTitle}>Mis Notas Académicas</Text>
        <Text style={styles.headerName}>{currentUser?.name}</Text>
        <View style={styles.promedioContainer}>
          <Text style={styles.promedioLabel}>Promedio General</Text>
          <Text style={[
            styles.promedioValue,
            { color: getNotaColor(parseFloat(calcularPromedioGeneral())) }
          ]}>
            {calcularPromedioGeneral()}
          </Text>
        </View>
      </View>

      <View style={styles.filterContainer}>
        <TouchableOpacity 
          style={[styles.filterButton, selectedPeriod === 'todos' && styles.filterButtonActive]}
          onPress={() => setSelectedPeriod('todos')}
        >
          <Text style={[styles.filterText, selectedPeriod === 'todos' && styles.filterTextActive]}>
            Todos
          </Text>
        </TouchableOpacity>
        {[1, 2, 3, 4].map(periodo => (
          <TouchableOpacity 
            key={periodo}
            style={[styles.filterButton, selectedPeriod === periodo && styles.filterButtonActive]}
            onPress={() => setSelectedPeriod(periodo)}
          >
            <Text style={[styles.filterText, selectedPeriod === periodo && styles.filterTextActive]}>
              P{periodo}
            </Text>
          </TouchableOpacity>
        ))}
      </View>

      <ScrollView
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }
      >
        {materias.map(materia => {
          const materiaNotes = notes[materia];
          if (!materiaNotes) return null;

          const promedio = calcularPromedioMateria(materiaNotes);
          const hasNotes = Object.values(materiaNotes).some(n => n !== null);

          return (
            <View key={materia} style={styles.materiaCard}>
              <View style={styles.materiaHeader}>
                <View style={styles.materiaHeaderLeft}>
                  <Text style={styles.materiaTitle}>{materia}</Text>
                  <Text style={[
                    styles.materiaPromedio,
                    { color: getNotaColor(parseFloat(promedio)) }
                  ]}>
                    Promedio: {promedio}
                  </Text>
                </View>
                {hasNotes && (
                  <Ionicons 
                    name="checkmark-circle" 
                    size={24} 
                    color="#28a745" 
                  />
                )}
              </View>

              <View style={styles.periodosGrid}>
                {[1, 2, 3, 4].map(periodo => {
                  if (selectedPeriod !== 'todos' && selectedPeriod !== periodo) {
                    return null;
                  }

                  const nota = materiaNotes[`periodo${periodo}`];
                  const notaValue = nota?.nota;

                  return (
                    <View key={periodo} style={styles.periodoCard}>
                      <Text style={styles.periodoLabel}>Periodo {periodo}</Text>
                      {notaValue !== undefined && notaValue !== null ? (
                        <>
                          <Text style={[
                            styles.notaValue,
                            { color: getNotaColor(notaValue) }
                          ]}>
                            {notaValue.toFixed(1)}
                          </Text>
                          {nota.descripcion && (
                            <Text style={styles.notaDescripcion} numberOfLines={2}>
                              {nota.descripcion}
                            </Text>
                          )}
                        </>
                      ) : (
                        <View style={styles.sinNota}>
                          <Ionicons name="remove-circle-outline" size={20} color="#adb5bd" />
                          <Text style={styles.sinNotaText}>Sin nota</Text>
                        </View>
                      )}
                    </View>
                  );
                })}
              </View>
            </View>
          );
        })}

        <View style={styles.legendContainer}>
          <Text style={styles.legendTitle}>Escala de Valoración</Text>
          <View style={styles.legendItems}>
            <LegendItem color="#28a745" text="4.5 - 5.0 Excelente" />
            <LegendItem color="#20c997" text="4.0 - 4.4 Bueno" />
            <LegendItem color="#ffc107" text="3.5 - 3.9 Aceptable" />
            <LegendItem color="#fd7e14" text="3.0 - 3.4 Bajo" />
            <LegendItem color="#dc3545" text="0.0 - 2.9 Reprobado" />
          </View>
        </View>
      </ScrollView>
    </View>
  );
}

const LegendItem = ({ color, text }) => (
  <View style={styles.legendItem}>
    <View style={[styles.legendColor, { backgroundColor: color }]} />
    <Text style={styles.legendText}>{text}</Text>
  </View>
);

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#f8f9fa' },
  centerContainer: { 
    flex: 1, 
    justifyContent: 'center', 
    alignItems: 'center',
    backgroundColor: '#f8f9fa' 
  },
  loadingText: { marginTop: 10, fontSize: 16, color: '#6c757d' },
  headerCard: {
    backgroundColor: '#007bff',
    padding: 20,
    borderBottomLeftRadius: 20,
    borderBottomRightRadius: 20,
  },
  headerTitle: { fontSize: 20, fontWeight: 'bold', color: '#fff' },
  headerName: { fontSize: 16, color: 'rgba(255,255,255,0.9)', marginTop: 5 },
  promedioContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: 15,
    backgroundColor: 'rgba(255,255,255,0.2)',
    padding: 15,
    borderRadius: 10,
  },
  promedioLabel: { fontSize: 16, color: '#fff', fontWeight: '500' },
  promedioValue: { fontSize: 32, fontWeight: 'bold', color: '#fff' },
  filterContainer: {
    flexDirection: 'row',
    padding: 15,
    justifyContent: 'space-around',
  },
  filterButton: {
    paddingVertical: 8,
    paddingHorizontal: 16,
    borderRadius: 20,
    backgroundColor: '#fff',
    borderWidth: 1,
    borderColor: '#e9ecef',
  },
  filterButtonActive: {
    backgroundColor: '#007bff',
    borderColor: '#007bff',
  },
  filterText: { fontSize: 14, color: '#495057', fontWeight: '500' },
  filterTextActive: { color: '#fff' },
  materiaCard: {
    backgroundColor: '#fff',
    marginHorizontal: 15,
    marginBottom: 15,
    borderRadius: 12,
    padding: 15,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 3,
    elevation: 3,
  },
  materiaHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 15,
    paddingBottom: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#e9ecef',
  },
  materiaHeaderLeft: { flex: 1 },
  materiaTitle: { fontSize: 16, fontWeight: '600', color: '#212529' },
  materiaPromedio: { fontSize: 14, fontWeight: '500', marginTop: 4 },
  periodosGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginHorizontal: -5,
  },
  periodoCard: {
    width: '48%',
    backgroundColor: '#f8f9fa',
    borderRadius: 8,
    padding: 12,
    margin: '1%',
    alignItems: 'center',
  },
  periodoLabel: { fontSize: 12, color: '#6c757d', marginBottom: 8 },
  notaValue: { fontSize: 28, fontWeight: 'bold' },
  notaDescripcion: {
    fontSize: 11,
    color: '#6c757d',
    marginTop: 5,
    textAlign: 'center',
  },
  sinNota: { alignItems: 'center', paddingVertical: 10 },
  sinNotaText: { fontSize: 12, color: '#adb5bd', marginTop: 5 },
  legendContainer: {
    backgroundColor: '#fff',
    marginHorizontal: 15,
    marginBottom: 20,
    borderRadius: 12,
    padding: 15,
  },
  legendTitle: { 
    fontSize: 16, 
    fontWeight: '600', 
    color: '#212529',
    marginBottom: 12 
  },
  legendItems: { gap: 8 },
  legendItem: { flexDirection: 'row', alignItems: 'center' },
  legendColor: {
    width: 20,
    height: 20,
    borderRadius: 4,
    marginRight: 10,
  },
  legendText: { fontSize: 14, color: '#495057' },
});