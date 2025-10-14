import React from 'react';
import { View, Text, StyleSheet } from 'react-native';

export default function PlanArea({ route, navigation }) {
  // Este es un componente de marcador de posición simple.
  // La lógica del formulario se ha eliminado temporalmente.
  
  return (
    <View style={styles.container}>
      <Text style={styles.title}>Plan de Area</Text>
      <Text>Pantalla de plan de área.</Text>
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
