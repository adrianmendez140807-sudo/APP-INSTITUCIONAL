// App.js
import React, { useEffect, useState } from 'react';
import { NavigationContainer } from '@react-navigation/native';
import AppNavigator from './navigation/AppNavigator';
import { initializeDatabases } from './database/index';
import LoadingScreen from './screens/Otros/LoadingScreen';

export default function App() {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    async function setup() {
      try {
        console.log('📱 Iniciando aplicación...');
        // Inicializar ambas bases de datos
        await initializeDatabases();
        setLoading(false);
        console.log("✅ Aplicación lista");
      } catch (error) {
        console.error("❌ Error inicializando la aplicación:", error);
        setError(error.message);
        setLoading(false);
      }
    }
    setup();
  }, []);

  if (error) {
    return (
      <LoadingScreen />
    );
  }

  if (loading) {
    return <LoadingScreen />;
  }

  return (
    <NavigationContainer>
      <AppNavigator />
    </NavigationContainer>
  );
}