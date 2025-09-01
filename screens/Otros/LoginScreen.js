import React, { useState } from "react";
import { View, Text, TextInput, Button, Alert, StyleSheet } from "react-native";
import { loginUser } from "../../database";

export default function LoginScreen({ navigation }) {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");

// Ejemplo dentro de LoginScreen.js
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
        navigation.navigate('AdminDashboard');
        break;
      default:
        // Si el rol no existe, muestra un error
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
        placeholder="Usuario"
        value={username}
        onChangeText={setUsername}
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
