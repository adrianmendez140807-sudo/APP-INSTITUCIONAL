import React, { useEffect, useState } from 'react';
import { NavigationContainer } from '@react-navigation/native';
import AppNavigator from './navigation/AppNavigator';
import dbService from './database'; // <-- Importa el objeto
import LoadingScreen from './screens/Otros/LoadingScreen';

export default function App() {
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function setup() {
      try {
        await dbService.initDatabase(); // <-- Usa la función desde el objeto
        setLoading(false);
        console.log("✅ Base de datos lista");
      } catch (error) {
        console.error("❌ Error inicializando la base de datos", error);
        setLoading(false);
      }
    }
    setup();
  }, []);

  if (loading) return <LoadingScreen />;

  return (
    <NavigationContainer>
      <AppNavigator />
    </NavigationContainer>
  );
}