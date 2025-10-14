import React from 'react';
import { View, Text, StyleSheet } from 'react-native';

export default function AnotacionesYNotas({ route, navigation }) {
  // Este es un componente de marcador de posición simple.
  // La lógica del formulario se ha eliminado temporalmente.
  
  return (
    <View style={styles.container}>
      <Text style={styles.title}>Anotaciones y Notas</Text>
      <Text>Pantalla de anotaciones y notas.</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  title: {
    fontSize: 22,
    fontWeight: 'bold',
    marginBottom: 15,
  },
});
