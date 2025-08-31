import { useEffect } from 'react';
import { initDB } from './database';
import { NavigationContainer } from '@react-navigation/native';
import AppNavigator from './navigation/AppNavigator';

export default function App() {
  useEffect(() => {
    initDB(); // Inicializa BD al iniciar la app
  }, []);

  return (
    <NavigationContainer>
      <AppNavigator />
    </NavigationContainer>
  );
}
