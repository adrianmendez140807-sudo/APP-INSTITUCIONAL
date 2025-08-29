// screens/RegisterStudentScreen.js
import React, { useState } from 'react';
import { View, Text, TextInput, Button, Alert, StyleSheet } from 'react-native';
import { collection, addDoc } from 'firebase/firestore';
import { db } from '../../firebase';

const RegisterStudentScreen = () => {
  const [nombre, setNombre] = useState('');
  const [apellido, setApellido] = useState('');
  const [grado, setGrado] = useState('');
  const [grupo, setGrupo] = useState('');

  const handleRegister = async () => {
    if (!nombre || !apellido || !grado || !grupo) {
      Alert.alert('Campos vacíos', 'Por favor, completa todos los campos.');
      return;
    }

    try {
      await addDoc(collection(db, 'estudiantes'), {
        nombre,
        apellido,
        grado,
        grupo,
        creadoEn: new Date()
      });

      Alert.alert('Éxito', 'Estudiante registrado correctamente');
      setNombre('');
      setApellido('');
      setGrado('');
      setGrupo('');
    } catch (error) {
      Alert.alert('Error', 'No se pudo registrar el estudiante: ' + error.message);
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Registrar Estudiante</Text>

      <TextInput
        style={styles.input}
        placeholder="Nombre"
        value={nombre}
        onChangeText={setNombre}
      />
      <TextInput
        style={styles.input}
        placeholder="Apellido"
        value={apellido}
        onChangeText={setApellido}
      />
      <TextInput
        style={styles.input}
        placeholder="Grado"
        value={grado}
        onChangeText={setGrado}
      />
      <TextInput
        style={styles.input}
        placeholder="Grupo"
        value={grupo}
        onChangeText={setGrupo}
      />

      <Button title="Registrar" onPress={handleRegister} />
    </View>
  );
};

export default RegisterStudentScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 24,
    justifyContent: 'center',
  },
  title: {
    fontSize: 24,
    marginBottom: 24,
    textAlign: 'center',
  },
  input: {
    borderBottomWidth: 1,
    paddingVertical: 8,
    marginBottom: 16,
  },
});
