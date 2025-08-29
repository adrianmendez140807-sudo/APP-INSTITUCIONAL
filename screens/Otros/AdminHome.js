import React from 'react';
import { View, Text, StyleSheet } from 'react-native';

export default function AdminHome() {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>Panel Administrativo</Text>
      <Text>Aquí va la gestión de usuarios, horarios y grupos</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 20, justifyContent: 'center' },
  title: { fontSize: 24, marginBottom: 15 }
});
