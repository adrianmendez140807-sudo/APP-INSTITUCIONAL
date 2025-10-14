import React from 'react';
import { View, Text, StyleSheet } from 'react-native';

export default function GrupoDirectivas({ route, navigation }) {
  // Este es un componente de marcador de posición simple.
  // La lógica del formulario se ha eliminado temporalmente.
  
  return (
    <View style={styles.container}>
      <Text style={styles.title}>Grupo de Directivas</Text>
      <Text>Pantalla de grupo de directivas.</Text>
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
