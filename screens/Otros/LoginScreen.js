// LoginScreen.js
import React, { useState, useEffect } from "react";
import { View, Text, TextInput, Button, Alert, StyleSheet } from "react-native";
import * as SQLite from "expo-sqlite";

const db = SQLite.openDatabase("usuarios.db");

export default function LoginScreen({ navigation }) {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");

  // Crear tabla usuarios y usuarios por defecto
  useEffect(() => {
    db.transaction((tx) => {
      tx.executeSql(
        "CREATE TABLE IF NOT EXISTS usuarios (id INTEGER PRIMARY KEY AUTOINCREMENT, username TEXT, password TEXT, role TEXT);"
      );

      // Insertar usuarios iniciales solo si no existen
      tx.executeSql(
        "SELECT * FROM usuarios WHERE role IN ('Secretaria', 'Rector', 'Coordinacion');",
        [],
        (_, { rows }) => {
          if (rows.length === 0) {
            tx.executeSql(
              "INSERT INTO usuarios (username, password, role) VALUES (?, ?, ?);",
              ["secretaria", "1234", "Secretaria"]
            );
            tx.executeSql(
              "INSERT INTO usuarios (username, password, role) VALUES (?, ?, ?);",
              ["rector", "1234", "Rector"]
            );
            tx.executeSql(
              "INSERT INTO usuarios (username, password, role) VALUES (?, ?, ?);",
              ["coordinacion", "1234", "Coordinacion"]
            );
          }
        }
      );
    });
  }, []);

  const handleLogin = () => {
    if (!username || !password) {
      Alert.alert("Error", "Por favor ingresa usuario y contraseña");
      return;
    }

    db.transaction((tx) => {
      tx.executeSql(
        "SELECT * FROM usuarios WHERE username = ? AND password = ?;",
        [username, password],
        (_, { rows }) => {
          if (rows.length > 0) {
            const user = rows._array[0];
            switch (user.role) {
              case "Secretaria":
                navigation.replace("SecretariaHome");
                break;
              case "Rector":
                navigation.replace("RectorHome");
                break;
              case "Coordinacion":
                navigation.replace("CoordinacionHome");
                break;
              case "Docente":
                navigation.replace("DocenteHome");
                break;
              case "Estudiante":
                navigation.replace("StudentHome");
                break;
              default:
                Alert.alert("Error", "Rol no reconocido");
                break;
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
      <Text style={styles.title}>Inicio de Sesión</Text>
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
  container: {
    flex: 1,
    justifyContent: "center",
    padding: 20,
    backgroundColor: "#f5f5f5",
  },
  title: {
    fontSize: 26,
    fontWeight: "bold",
    textAlign: "center",
    marginBottom: 30,
  },
  input: {
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 10,
    padding: 10,
    marginBottom: 15,
    backgroundColor: "#fff",
  },
});
