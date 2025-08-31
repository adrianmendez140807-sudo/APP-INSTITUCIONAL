import React, { useState, useEffect } from "react";
import { View, Text, TextInput, Button, Alert, StyleSheet } from "react-native";
import * as SQLite from "expo-sqlite";

const db = SQLite.openDatabase("school.db");

export default function AñadirEstudiante({ navigation }) {
  const [nombre, setNombre] = useState("");
  const [correo, setCorreo] = useState("");

  // Crear tabla si no existe
  useEffect(() => {
    db.transaction((tx) => {
      tx.executeSql(
        `CREATE TABLE IF NOT EXISTS usuarios (
          id INTEGER PRIMARY KEY AUTOINCREMENT,
          nombre TEXT NOT NULL,
          correo TEXT UNIQUE NOT NULL,
          rol TEXT NOT NULL
        );`
      );
    });
  }, []);

  // Guardar estudiante con rol
  const guardarEstudiante = () => {
    if (!nombre || !correo) {
      Alert.alert("Error", "Por favor, completa todos los campos");
      return;
    }

    db.transaction((tx) => {
      tx.executeSql(
        "INSERT INTO usuarios (nombre, correo, rol) VALUES (?, ?, ?);",
        [nombre, correo, "estudiante"], // el rol siempre será "estudiante"
        (_, result) => {
          Alert.alert("Éxito", "Estudiante agregado correctamente");
          setNombre("");
          setCorreo("");
          navigation.navigate("StudentHome"); // después de guardar, vuelve a StudentHome
        },
        (_, error) => {
          console.log(error);
          Alert.alert("Error", "No se pudo guardar el estudiante (correo duplicado?)");
          return true; // detener la transacción en caso de error
        }
      );
    });
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Añadir Estudiante</Text>
      <TextInput
        style={styles.input}
        placeholder="Nombre del estudiante"
        value={nombre}
        onChangeText={setNombre}
      />
      <TextInput
        style={styles.input}
        placeholder="Correo del estudiante"
        value={correo}
        onChangeText={setCorreo}
        keyboardType="email-address"
      />
      <Button title="Guardar Estudiante" onPress={guardarEstudiante} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    justifyContent: "center",
    backgroundColor: "#fff",
  },
  title: {
    fontSize: 22,
    marginBottom: 20,
    textAlign: "center",
    fontWeight: "bold",
  },
  input: {
    borderWidth: 1,
    borderColor: "#aaa",
    borderRadius: 8,
    padding: 10,
    marginBottom: 15,
  },
});
