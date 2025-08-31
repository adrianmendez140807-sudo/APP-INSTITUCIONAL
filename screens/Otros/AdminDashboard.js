import React from 'react';
import { View, Text, Button, StyleSheet } from 'react-native';

const AdminDashboard = ({ navigation }) => {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>Panel Administrativo</Text>

      <View style={styles.buttonContainer}>
        <Button
          title="Registrar Estudiante"
          onPress={() => navigation.navigate('RegistrarEstudiante')}
        />
      </View>

      {/* Pa que no se me olvide como agregar botones, solo copia lo de arriba */}
    </View>
  );
};

export default AdminDashboard;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 24,
    justifyContent: 'center',
  },
  title: {
    fontSize: 26,
    marginBottom: 30,
    textAlign: 'center',
  },
  buttonContainer: {
    marginVertical: 12,
  },
});
