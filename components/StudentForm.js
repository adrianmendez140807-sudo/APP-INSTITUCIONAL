// components/StudentForm.js
import React, { useState } from 'react';
import { View, TextInput, Button, StyleSheet, Alert } from 'react-native';
import { getDatabase, ref, push } from 'firebase/database';

const StudentForm = () => {
  const [name, setName] = useState('');
  const [grade, setGrade] = useState('');
  const [group, setGroup] = useState('');

  const handleRegister = () => {
    if (!name || !grade || !group) {
      Alert.alert('Error', 'Por favor, completa todos los campos.');
      return;
    }

    const db = getDatabase();
    const studentsRef = ref(db, 'students/');
    push(studentsRef, {
      name,
      grade,
      group,
      registeredAt: Date.now()
    })
    .then(() => {
      Alert.alert('Éxito', 'Estudiante registrado correctamente');
      setName('');
      setGrade('');
      setGroup('');
    })
    .catch((error) => {
      Alert.alert('Error', error.message);
    });
  };

  return (
    <View style={styles.container}>
      <TextInput
        placeholder="Nombre del estudiante"
        style={styles.input}
        value={name}
        onChangeText={setName}
      />
      <TextInput
        placeholder="Grado"
        style={styles.input}
        value={grade}
        onChangeText={setGrade}
      />
      <TextInput
        placeholder="Grupo"
        style={styles.input}
        value={group}
        onChangeText={setGroup}
      />
      <Button title="Registrar estudiante" onPress={handleRegister} />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: 16
  },
  input: {
    borderBottomWidth: 1,
    marginBottom: 12,
    padding: 8
  }
});

export default StudentForm;
