// screens/LoadingScreen.js
import React, { useEffect } from 'react';
import { View, ActivityIndicator, StyleSheet } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';

export default function LoadingScreen({ navigation }) {
  useEffect(() => {
    const check = async () => {
      try {
        const raw = await AsyncStorage.getItem('currentUser');
        if (!raw) {
          navigation.replace('Login');
          return;
        }
        const user = JSON.parse(raw);
        // reutilizamos la misma lógica de redirección del Login
        const role = user.role || '';
        const r = role.toString().toLowerCase();
        if (r.includes('admin')) return navigation.replace('AdminHome', { user });
        if (r.includes('secretar')) return navigation.replace('SecretariaHome', { user });
        if (r.includes('docent')) return navigation.replace('DocenteHome', { user });
        if (r.includes('coordin')) return navigation.replace('CoordinadorHome', { user });
        if (r.includes('rector')) return navigation.replace('RectorHome', { user });
        if (r.includes('estudiant')) return navigation.replace('EstudianteHome', { user });
        // fallback
        navigation.replace('Login');
      } catch (e) {
        console.log('Error en LoadingScreen:', e);
        navigation.replace('Login');
      }
    };
    check();
  }, [navigation]);

  return (
    <View style={styles.container}>
      <ActivityIndicator size="large" />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex:1, justifyContent:'center', alignItems:'center' }
});
