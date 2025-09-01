import React, { useState } from 'react';
import { View, Text, TextInput, Button, Alert, StyleSheet } from 'react-native';
import dbService from '../../../database';

export default function AñadirEstudiante() {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [documentNumber, setDocumentNumber] = useState('');
  const [password, setPassword] = useState('');
  const role = 'estudiante';

  function validateUserData(name, email, password, role, documentNumber) {
    if (!name || !email || !password || !role || !documentNumber) return false;
    if (!email.includes('@')) return false;
    if (password.length < 6) return false;
    if (!/^\d+$/.test(documentNumber)) return false;
    if (documentNumber.length < 6) return false;
    return true;
  }

  const handleAddStudent = async () => {
    if (validateUserData(name, email, password, role, documentNumber)) {
      try {
        await dbService.addUser(name, email, password, role, documentNumber);
        Alert.alert('Éxito', 'Estudiante creado correctamente');
        setName('');
        setEmail('');
        setDocumentNumber('');
        setPassword('');
      } catch (error) {
        Alert.alert('Error', 'No se pudo crear el estudiante. ¿El correo o documento ya existe?');
      }
    } else {
      Alert.alert('Error', 'Datos inválidos');
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Añadir Estudiante</Text>
      <TextInput
        style={styles.input}
        placeholder="Nombre completo"
        value={name}
        onChangeText={setName}
      />
      <TextInput
        style={styles.input}
        placeholder="Correo electrónico"
        value={email}
        onChangeText={setEmail}
        keyboardType="email-address"
      />
      <TextInput
        style={styles.input}
        placeholder="Número de documento"
        value={documentNumber}
        onChangeText={setDocumentNumber}
        keyboardType="numeric"
      />
      <TextInput
        style={styles.input}
        placeholder="Contraseña"
        value={password}
        onChangeText={setPassword}
        secureTextEntry
      />
      <Button title="Agregar Estudiante" onPress={handleAddStudent} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 20, justifyContent: 'center' },
  title: { fontSize: 22, fontWeight: 'bold', marginBottom: 20, textAlign: 'center' },
  input: { borderWidth: 1, borderColor: '#ccc', padding: 10, marginBottom: 15, borderRadius: 5 },
});
