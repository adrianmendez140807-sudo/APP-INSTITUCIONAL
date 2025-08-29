import React, { useEffect, useState } from 'react';
import { View, Text, FlatList, Button, Alert, StyleSheet } from 'react-native';
import { loadData, deleteItem } from '../../../storage';

export default function ListaDocentes() {
  const [estudiantes, setEstudiantes] = useState([]);

  const cargarEstudiantes = async () => {
    const data = await loadData('estudiantes');
    setEstudiantes(data);
  };

  const eliminarEstudiante = async (id) => {
    Alert.alert(
      'Confirmar',
      '¿Seguro que quieres eliminar este estudiante?',
      [
        { text: 'Cancelar', style: 'cancel' },
        {
          text: 'Eliminar',
          style: 'destructive',
          onPress: async () => {
            const nuevaLista = await deleteItem('estudiantes', id);
            setEstudiantes(nuevaLista);
          }
        }
      ]
    );
  };

  useEffect(() => {
    cargarEstudiantes();
  }, []);

  return (
    <View style={styles.container}>
      <FlatList
        data={estudiantes}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <View style={styles.item}>
            <Text>{item.nombre} ({item.usuario})</Text>
            <Button title="Eliminar" color="red" onPress={() => eliminarEstudiante(item.id)} />
          </View>
        )}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 20 },
  item: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: 10 }
});
