import React from "react";
import { View, Text, StyleSheet } from "react-native";

export default function AdminScreen({ route }) {
  const { user } = route.params;

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Bienvenido {user.role}</Text>
      <Text>Este panel es solo de lectura para rectoría y coordinación.</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, justifyContent: "center", alignItems: "center" },
  title: { fontSize: 20, fontWeight: "bold" },
});
