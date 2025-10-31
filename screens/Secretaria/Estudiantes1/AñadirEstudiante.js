import React, { useState } from 'react';
import { View, Text, TextInput, Button, Alert, StyleSheet, ScrollView } from 'react-native';
import { Picker } from '@react-native-picker/picker';
import dbService from '../../../database';

const GRUPOS_FIJOS = [
  'Sexto-1', 'Sexto-2',
  'Séptimo-1', 'Séptimo-2',
  'Octavo-1', 'Octavo-2',
  'Noveno-1', 'Noveno-2',
  'Décimo-1', 'Décimo-2',
  'Once-1', 'Once-2'
];

export default function AñadirEstudiante() {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [documentNumber, setDocumentNumber] = useState('');
  const [password, setPassword] = useState('');
  const [grado, setGrado] = useState(GRUPOS_FIJOS[0]);
  const role = 'estudiante';

  function validateUserData(name, email, password, role, documentNumber, grado) {
    if (!name || !email || !password || !role || !documentNumber || !grado) return false;
    if (!email.includes('@')) return false;
    if (password.length < 6) return false;
    if (!/^\d+$/.test(documentNumber)) return false;
    if (documentNumber.length < 6) return false;
    return true;
  }

  const handleAddStudent = async () => {
    if (validateUserData(name, email, password, role, documentNumber, grado)) {
      try {
        const studentData = {
          name,
          email,
          password,
          role,
          documentNumber,
          grado,
        };
        await dbService.addUser(studentData);
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
    <ScrollView style={styles.container}>
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
      <Text style={styles.label}>Grupo:</Text>
      <View style={styles.pickerContainer}>
        <Picker
          selectedValue={grado}
          onValueChange={(itemValue) => setGrado(itemValue)}
        >
          {GRUPOS_FIJOS.map(g => <Picker.Item key={g} label={g} value={g} />)}
        </Picker>
      </View>
      <Button title="Agregar Estudiante" onPress={handleAddStudent} />
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 20 },
  title: { fontSize: 22, fontWeight: 'bold', marginBottom: 20, textAlign: 'center' },
  input: { borderWidth: 1, borderColor: '#ccc', padding: 10, marginBottom: 15, borderRadius: 5 },
  label: { fontSize: 16, fontWeight: '600', marginBottom: 5 },
  pickerContainer: { borderWidth: 1, borderColor: '#ccc', borderRadius: 5, marginBottom: 20 },
});
