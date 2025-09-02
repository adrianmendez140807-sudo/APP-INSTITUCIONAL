import React, { useState, useEffect, useMemo } from 'react';
import { View, Text, StyleSheet, ScrollView, Alert } from 'react-native';
import dbService from '../../../database';

export default function DetallesNotasEstudiante({ route }) {
  const { student } = route.params;
  const [notes, setNotes] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchNotes = async () => {
      if (!student?.id) return;
      try {
        // Esta función debe ser creada en tu 'database.js'
        const studentNotes = await dbService.getNotesByStudent(student.id);
        setNotes(studentNotes);
      } catch (error) {
        console.error("Error al obtener las notas:", error);
        Alert.alert("Error", "No se pudieron cargar las notas del estudiante.");
      } finally {
        setIsLoading(false);
      }
    };

    fetchNotes();
  }, [student.id]);

  // Agrupamos las notas por materia para una mejor visualización
  const groupedNotes = useMemo(() => {
    return notes.reduce((acc, note) => {
      const { materia } = note;
      if (!acc[materia]) {
        acc[materia] = [];
      }
      acc[materia].push(note);
      return acc;
    }, {});
  }, [notes]);

  if (isLoading) {
    return <View style={styles.container}><Text>Cargando notas...</Text></View>;
  }

  return (
    <ScrollView style={styles.container}>
      <Text style={styles.title}>Notas de {student.name}</Text>

      {Object.keys(groupedNotes).length > 0 ? (
        Object.entries(groupedNotes).map(([materia, notasDeMateria]) => (
          <View key={materia} style={styles.subjectContainer}>
            <Text style={styles.subjectTitle}>{materia}</Text>
            {notasDeMateria.map((nota) => (
              <View key={nota.id} style={styles.noteItem}>
                <Text style={styles.noteDescription}>{nota.descripcion || `Nota del periodo ${nota.periodo}`}</Text>
                <Text style={[styles.noteValue, nota.nota < 3 ? styles.noteFail : styles.notePass]}>
                  {nota.nota.toFixed(1)}
                </Text>
              </View>
            ))}
          </View>
        ))
      ) : (
        <Text style={styles.emptyText}>Este estudiante aún no tiene notas registradas.</Text>
      )}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 20, backgroundColor: '#f8f9fa' },
  title: { fontSize: 24, fontWeight: 'bold', marginBottom: 25, color: '#343a40', textAlign: 'center' },
  subjectContainer: {
    backgroundColor: '#ffffff',
    borderRadius: 10,
    padding: 15,
    marginBottom: 20,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 4,
    elevation: 3,
  },
  subjectTitle: { fontSize: 20, fontWeight: '600', color: '#007bff', marginBottom: 10, borderBottomWidth: 1, borderBottomColor: '#dee2e6', paddingBottom: 5 },
  noteItem: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingVertical: 8, borderBottomWidth: 1, borderBottomColor: '#f1f3f5' },
  noteDescription: { fontSize: 16, color: '#495057' },
  noteValue: { fontSize: 18, fontWeight: 'bold' },
  notePass: { color: '#28a745' },
  noteFail: { color: '#dc3545' },
  emptyText: { textAlign: 'center', marginTop: 50, fontSize: 16, color: '#6c757d' },
});
