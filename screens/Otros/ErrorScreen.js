import React from 'react';
import { View, Text, StyleSheet, Button, ScrollView } from 'react-native';
import * as Updates from 'expo-updates';

const ErrorScreen = ({ message, error }) => {
  const handleRestart = () => {
    Updates.reloadAsync();
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>¡Oops! Algo salió mal</Text>
      <Text style={styles.message}>{message}</Text>

      {/* Muestra el error técnico solo en modo de desarrollo para facilitar la depuración */}
      {__DEV__ && error && (
        <ScrollView style={styles.errorContainer}>
          <Text style={styles.errorDetails}>{error.toString()}</Text>
        </ScrollView>
      )}

      <Button title="Reiniciar Aplicación" onPress={handleRestart} color="#721c24" />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
    backgroundColor: '#f8d7da',
  },
  title: {
    fontSize: 22,
    fontWeight: 'bold',
    color: '#721c24',
    marginBottom: 10,
    textAlign: 'center',
  },
  message: {
    fontSize: 16,
    color: '#721c24',
    textAlign: 'center',
    marginBottom: 20,
  },
  errorContainer: {
    maxHeight: '50%',
    backgroundColor: '#f5c6cb',
    borderRadius: 5,
    padding: 10,
    marginBottom: 20,
  },
  errorDetails: {
    fontSize: 12,
    color: '#721c24',
  },
});

export default ErrorScreen;