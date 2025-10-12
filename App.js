import React, { useEffect, useState } from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import AppNavigator from './navigation/AppNavigator';
import dbService from './database'; // <-- Importa el objeto
import LoadingScreen from './screens/Otros/LoadingScreen';
import LoginScreen from './screens/Otros/LoginScreen';

const Stack = createStackNavigator();

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
      <Stack.Navigator initialRouteName="Login">
        <Stack.Screen
          name="Login"
          component={LoginScreen}
          options={{ headerShown: false }}
        />
        {/* Agrega aquí las otras pantallas según los roles */}
      </Stack.Navigator>
    </NavigationContainer>
  );
}