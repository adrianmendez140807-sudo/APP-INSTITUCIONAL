import React, { useState } from "react";
import { View, TextInput, Button, StyleSheet } from "react-native";

export default function UserForm({ onAdd }) {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [role, setRole] = useState("");

  return (
    <View style={styles.form}>
      <TextInput
        style={styles.input}
        placeholder="Usuario"
        value={username}
        onChangeText={setUsername}
      />
      <TextInput
        style={styles.input}
        placeholder="Contraseña"
        value={password}
        secureTextEntry
        onChangeText={setPassword}
      />
      <TextInput
        style={styles.input}
        placeholder="Rol (estudiante/docente)"
        value={role}
        onChangeText={setRole}
      />
      <Button title="Agregar" onPress={() => {
        if (username && password && role) {
          onAdd(username, password, role);
          setUsername(""); setPassword(""); setRole("");
        }
      }} />
    </View>
  );
}

const styles = StyleSheet.create({
  form: { marginBottom: 15 },
  input: {
    borderWidth: 1,
    borderColor: "#ccc",
    marginBottom: 8,
    padding: 10,
    borderRadius: 5,
  },
});
