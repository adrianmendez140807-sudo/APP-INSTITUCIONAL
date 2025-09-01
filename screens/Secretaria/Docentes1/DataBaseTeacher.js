import React from 'react';
import { View, Text, StyleSheet } from 'react-native';

export default function BaseDatosDocentes1({ route }) {
  const { teacher } = route.params || {};

  if (!teacher) {
    return (
      <View style={styles.container}>
        <Text style={styles.title}>No se seleccionó ningún docente.</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Hoja de Vida de {teacher.name}</Text>
      <Text>Documento: {teacher.documentNumber}</Text>
      <Text>Email: {teacher.email}</Text>
      {/* Agrega aquí más campos y funcionalidades */}
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 20 },
  title: { fontSize: 22, fontWeight: 'bold', marginBottom: 15 },
});
