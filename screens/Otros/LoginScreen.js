import React, { useState, useEffect } from "react";
import { View, Text, TextInput, TouchableOpacity, StyleSheet, Alert } from "react-native";
import * as SQLite from "expo-sqlite";
import { useNavigation } from "@react-navigation/native";

export default function LoginScreen() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const navigation = useNavigation();

  // Abrir BD
  const db = SQLite.openDatabase("school.db");

  // Crear tabla usuarios si no existe
  useEffect(() => {
    db.transaction((tx) => {
      tx.executeSql(
        `CREATE TABLE IF NOT EXISTS users (
          id INTEGER PRIMARY KEY AUTOINCREMENT,
          username TEXT UNIQUE,
          password TEXT,
          role TEXT
        );`
      );
    });

    // Insertar usuarios base si no existen
    db.transaction((tx) => {
      tx.executeSql(
        `INSERT OR IGNORE INTO users (username, password, role) VALUES 
        ('secretaria', '1234', 'secretaria'),
        ('rector', '1234', 'rector'),
        ('coordinacion', '1234', 'coordinacion');`
      );
    });
  }, []);

  // Función de login
  const handleLogin = () => {
    if (!username || !password) {
      Alert.alert("Error", "Por favor ingresa usuario y contraseña");
      return;
    }

    db.transaction((tx) => {
      tx.executeSql(
        "SELECT * FROM users WHERE username = ? AND password = ?",
        [username, password],
        (_, { rows }) => {
          if (rows.length > 0) {
            const user = rows.item(0);

            // Redirigir según el rol
            if (user.role === "secretaria") {
              navigation.replace("SecretariaHome");
            } else if (user.role === "rector") {
              navigation.replace("RectorHome");
            } else if (user.role === "coordinacion") {
              navigation.replace("CoordinacionHome");
            } else if (user.role === "docente") {
              navigation.replace("DocenteHome");
            } else if (user.role === "estudiante") {
              navigation.replace("StudentHome"); // tu pantalla de estudiante
            } else {
              Alert.alert("Error", "Rol no reconocido");
            }
          } else {
            Alert.alert("Error", "Usuario o contraseña incorrectos");
          }
        }
      );
    });
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Iniciar Sesión</Text>

      <TextInput
        placeholder="Usuario"
        style={styles.input}
        value={username}
        onChangeText={setUsername}
      />

      <TextInput
        placeholder="Contraseña"
        style={styles.input}
        value={password}
        secureTextEntry
        onChangeText={setPassword}
      />

      <TouchableOpacity style={styles.button} onPress={handleLogin}>
        <Text style={styles.buttonText}>Entrar</Text>
      </TouchableOpacity>
    </View>
  );
}

// Estilos
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f9f9f9",
    alignItems: "center",
    justifyContent: "center",
    padding: 20,
  },
  title: {
    fontSize: 26,
    fontWeight: "bold",
    marginBottom: 40,
    color: "#333",
  },
  input: {
    width: "100%",
    height: 50,
    borderColor: "#ccc",
    borderWidth: 1,
    borderRadius: 10,
    marginBottom: 20,
    paddingHorizontal: 15,
    backgroundColor: "#fff",
  },
  button: {
    width: "100%",
    height: 50,
    backgroundColor: "#007bff",
    borderRadius: 10,
    alignItems: "center",
    justifyContent: "center",
  },
  buttonText: {
    color: "#fff",
    fontSize: 18,
    fontWeight: "bold",
  },
});
