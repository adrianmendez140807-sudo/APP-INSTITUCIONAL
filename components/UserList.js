import React from "react";
import { View, Text, Button, StyleSheet } from "react-native";

export default function UserList({ user, onDelete }) {
  return (
    <View style={styles.card}>
      <Text style={styles.text}>
        {user.username} ({user.role})
      </Text>
      {user.role !== "rectoria" &&
       user.role !== "coordinacion" &&
       user.role !== "secretaria" && (
        <Button title="Eliminar" onPress={() => onDelete(user.id)} />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    flexDirection: "row",
    justifyContent: "space-between",
    padding: 10,
    borderBottomWidth: 1,
    borderColor: "#ddd",
  },
  text: { fontSize: 16 },
});
