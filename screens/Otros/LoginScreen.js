// filepath: [LoginScreen.js](http://_vscodecontentref_/5)
import React, { useState } from "react";
import { View, Text, TextInput, Button, Alert, StyleSheet } from "react-native";
import dbService from "../../database"; // Importa el servicio correctamente

export default function LoginScreen({ navigation }) {
  const [email, setEmail] = useState(""); // Cambia username por email
  const [password, setPassword] = useState("");

  const handleLogin = async () => {
    const user = await dbService.getUserByLogin(email, password);
    if (user) {
      switch (user.role) {
        case 'docente':
          navigation.navigate('DocenteHome');
          break;
        case 'estudiante':
          navigation.navigate('StudentHome');
          break;
        case 'coordinador':
          navigation.navigate('CoordinadorHome');
          break;
        case 'rector':
          navigation.navigate('RectorHome');
          break;
        case 'secretaria':
          navigation.navigate('SecretariaHome');
          break;
        case 'admin':
          navigation.navigate('AdminHome'); // Asegúrate que el nombre coincida con tu navegador
          break;
        default:
          Alert.alert('Error', 'Rol de usuario no reconocido');
      }
    } else {
      Alert.alert('Error', 'Usuario o contraseña incorrectos');
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Acceso Institucional</Text>
      <TextInput
        style={styles.input}
        placeholder="Correo electrónico"
        value={email}
        onChangeText={setEmail}
        keyboardType="email-address"
      />
      <TextInput
        style={styles.input}
        placeholder="Contraseña"
        secureTextEntry
        value={password}
        onChangeText={setPassword}
      />
      <Button title="Ingresar" onPress={handleLogin} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, justifyContent: "center", padding: 20 },
  title: { fontSize: 24, textAlign: "center", marginBottom: 20 },
  input: {
    borderWidth: 1,
    borderColor: "#ccc",
    marginBottom: 10,
    padding: 10,
    borderRadius: 5,
  },
});
