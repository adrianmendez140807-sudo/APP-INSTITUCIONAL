import React, { useEffect, useState } from 'react';
import { View, Text, FlatList, TouchableOpacity, StyleSheet } from 'react-native';
import dbService from '../../../database';

export default function ListaDocentes({ navigation }) {
  const [teachers, setTeachers] = useState([]);

  useEffect(() => {
    const fetchTeachers = async () => {
      const all = await dbService.getUsers();
      // Filtra solo docentes
      setTeachers(all.filter(u => u.role === 'docente'));
    };
    fetchTeachers();
    // Puedes agregar un listener para actualizar la lista cuando vuelvas a esta pantalla
    const unsubscribe = navigation.addListener('focus', fetchTeachers);
    return unsubscribe;
  }, [navigation]);

  const handleSelectTeacher = (teacher) => {
    navigation.navigate('BaseDatosDocentes', { teacher });
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Lista de Docentes</Text>
      <FlatList
        data={teachers}
        keyExtractor={item => item.id.toString()}
        renderItem={({ item }) => (
          <TouchableOpacity style={styles.item} onPress={() => handleSelectTeacher(item)}>
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
