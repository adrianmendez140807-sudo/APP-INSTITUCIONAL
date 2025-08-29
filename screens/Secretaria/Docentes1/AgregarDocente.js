import React, { useState } from 'react';
import { View, Text, TextInput, Button, Alert, StyleSheet } from 'react-native';
import { saveData, loadData } from '../../../storage';
import { v4 as uuidv4 } from 'uuid';

export default function AgregarDocente({ navigation }) {
  const [nombre, setNombre] = useState('');
  const [usuario, setUsuario] = useState('');
  const [contraseña, setContraseña] = useState('');

  const handleGuardar = async () => {
    if (!nombre.trim() || !usuario.trim() || !contraseña.trim()) {
      Alert.alert('Error', 'Todos los campos son obligatorios.');
      return;
    }

    const estudiantes = await loadData('estudiantes');
    const nuevoEstudiante = {
      id: uuidv4(),
      nombre,
      usuario,
      contraseña,
      role: 'estudiante'
    };

    await saveData('estudiantes', [...estudiantes, nuevoEstudiante]);
    Alert.alert('Éxito', 'Estudiante registrado correctamente.');
    navigation.goBack();
  };

  return (
    <View style={styles.container}>
      <Text>Nombre:</Text>
      <TextInput style={styles.input} value={nombre} onChangeText={setNombre} />
      <Text>Usuario:</Text>
      <TextInput style={styles.input} value={usuario} onChangeText={setUsuario} />
      <Text>Contraseña:</Text>
      <TextInput style={styles.input} secureTextEntry value={contraseña} onChangeText={setContraseña} />
      <Button title="Guardar" onPress={handleGuardar} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 20 },
  input: { borderWidth: 1, marginBottom: 12, padding: 8, borderRadius: 4 }
});
