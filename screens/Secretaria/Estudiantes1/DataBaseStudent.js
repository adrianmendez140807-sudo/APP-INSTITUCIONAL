import React from 'react';
import { View, Text, StyleSheet } from 'react-native';

export default function BaseDatosEstudiantes({ route }) {
  const { student } = route.params || {};

  if (!student) {
    return (
      <View style={styles.container}>
        <Text style={styles.title}>No se seleccionó ningún estudiante.</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Hoja de Vida de {student.name}</Text>
      <Text>Documento: {student.documentNumber}</Text>
      <Text>Email: {student.email}</Text>
      {/* Agrega aquí más campos y funcionalidades */}
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 20 },
  title: { fontSize: 22, fontWeight: 'bold', marginBottom: 15 },
});