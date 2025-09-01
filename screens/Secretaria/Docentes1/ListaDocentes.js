import React, { useEffect, useState } from 'react';
import { View, Text, FlatList, TouchableOpacity, StyleSheet } from 'react-native';
import dbService from '../../../database';

export default function ListaEstudiantes({ navigation }) {
  const [students, setStudents] = useState([]);

  useEffect(() => {
    const fetchStudents = async () => {
      const all = await dbService.getUsers();
      // Filtra solo estudiantes
      setStudents(all.filter(u => u.role === 'estudiante'));
    };
    fetchStudents();
    // Puedes agregar un listener para actualizar la lista cuando vuelvas a esta pantalla
    const unsubscribe = navigation.addListener('focus', fetchStudents);
    return unsubscribe;
  }, [navigation]);

  const handleSelectStudent = (student) => {
    navigation.navigate('BaseDatosEstudiantes', { student });
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Lista de Estudiantes</Text>
      <FlatList
        data={students}
        keyExtractor={item => item.id.toString()}
        renderItem={({ item }) => (
          <TouchableOpacity style={styles.item} onPress={() => handleSelectStudent(item)}>
            <Text style={styles.name}>{item.name}</Text>
            <Text style={styles.document}>{item.documentNumber}</Text>
          </TouchableOpacity>
        )}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 20 },
  title: { fontSize: 22, fontWeight: 'bold', marginBottom: 15 },
  item: { padding: 15, backgroundColor: '#eaf6ff', marginBottom: 10, borderRadius: 8 },
  name: { fontSize: 18, fontWeight: 'bold' },
  document: { fontSize: 14, color: '#555' },
});
