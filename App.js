import React, { useEffect } from 'react';
import { NavigationContainer } from '@react-navigation/native';
import AppNavigator from './navigation/AppNavigator';
import { initDatabase } from './database';

export default function App() {
  useEffect(() => {
    async function setup() {
      try {
        await initDatabase();
        console.log("✅ Base de datos lista");
      } catch (error) {
        console.error("❌ Error inicializando la base de datos", error);
      }
    }
    setup();
  }, []);

  return (
    <NavigationContainer>
      <AppNavigator />
    </NavigationContainer>
  );
}
