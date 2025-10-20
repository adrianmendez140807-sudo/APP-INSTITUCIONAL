// screens/Secretaria/SecretariaHome.js
import React, { useState, useEffect } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, LayoutAnimation, Platform, UIManager } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { LinearGradient } from 'expo-linear-gradient';

if (Platform.OS === 'android' && UIManager.setLayoutAnimationEnabledExperimental) {
  UIManager.setLayoutAnimationEnabledExperimental(true);
}

export default function DocenteHome({ navigation }) {
  const [expanded, setExpanded] = useState(null);
  const [currentUser, setCurrentUser] = useState(null);

  useEffect(() => {
    const getCurrentUser = async () => {
      const user = await AsyncStorage.getItem('currentUser');
      setCurrentUser(JSON.parse(user));
    };
    getCurrentUser();
  }, []);

  const toggleExpand = (section) => {
    LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut);
    setExpanded(expanded === section ? null : section);
  };

  const logout = async () => {
    await AsyncStorage.removeItem('currentUser');
    navigation.replace('Login');
  };

  return (
    <LinearGradient colors={['#3056ffff', '#59ff91ff']} style={styles.container}>
      <Text style={styles.title}>Bienvenido Docente</Text>

      <View style={styles.grid}>
        {/* Materias */}
        <TouchableOpacity style={styles.card} onPress={() => toggleExpand('materias')}>
          <Text style={styles.cardText}>Materias</Text>
        </TouchableOpacity>

        {/* Estudiantes */}
        <TouchableOpacity style={styles.card} onPress={() => toggleExpand('estudiantes')}>
          <Text style={styles.cardText}>Estudiantes</Text>
        </TouchableOpacity>
      </View>

      <View style={styles.grid}>
        {/* Comunicación */}
        <TouchableOpacity style={styles.card} onPress={() => toggleExpand('comunicacion')}>
          <Text style={styles.cardText}>Comunicación</Text>
        </TouchableOpacity>

        {/* Notas */}
        <TouchableOpacity style={styles.card} onPress={() => toggleExpand('notas')}>
          <Text style={styles.cardText}>Notas</Text>
        </TouchableOpacity>
      </View>

      {/* Ajustes */}
      <View style={styles.grid}>
        <TouchableOpacity style={[styles.card, { backgroundColor: 'rgba(96, 68, 255, 0.7)' }]} onPress={() => toggleExpand('ajustes')}>
          <Text style={styles.cardText}>Ajustes</Text>
        </TouchableOpacity>
      </View>

      {/* Sub-opciones dinámicas */}
      {expanded === 'estudiantes' && (
        <View style={styles.dropdown}>
          <TouchableOpacity style={styles.dropdownItem} onPress={() => navigation.navigate('ListadoDeEstudiantes')}>
            <Text style={styles.dropdownText}>📋 Listado de Estudiantes</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.dropdownItem} onPress={() => navigation.navigate('AnotacionesYNotas')}>
            <Text style={styles.dropdownText}>🗃️ Anotaciones y Notas</Text>
          </TouchableOpacity>
        </View>
      )}

      {expanded === 'materias' && (
        <View style={styles.dropdown}>
          <TouchableOpacity style={styles.dropdownItem} onPress={() => navigation.navigate('RegistrarMaterias')}>
            <Text style={styles.dropdownText}>➕ Registrar Materias</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.dropdownItem} onPress={() => navigation.navigate('PlanArea')}>
            <Text style={styles.dropdownText}>📋 Plan de Area</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.dropdownItem} onPress={() => navigation.navigate('MateriasRegistradas')}>
            <Text style={styles.dropdownText}>📋 Materias registradas</Text>
          </TouchableOpacity>
        </View>
      )}

      {expanded === 'notas' && (
        <View style={styles.dropdown}>
          <TouchableOpacity style={styles.dropdownItem} onPress={() => navigation.navigate('PublicarNotas')}>
            <Text style={styles.dropdownText}>✅ Publicar notas a los estudiantes</Text>
          </TouchableOpacity>
        </View>
      )}

      {expanded === 'comunicacion' && (
        <View style={styles.dropdown}>
          <TouchableOpacity style={styles.dropdownItem} onPress={() => navigation.navigate('GrupoDirectivas')}>
            <Text style={styles.dropdownText}>📢 Grupos con Directivas</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.dropdownItem} onPress={() => navigation.navigate('GrupoEstudiantes')}>
            <Text style={styles.dropdownText}>💬 Grupos con estudiantes</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.dropdownItem} onPress={() => navigation.navigate('MensajeriaHome')}>
            <Text style={styles.dropdownText}>📬 Bandeja de Entrada</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.dropdownItem} onPress={() => navigation.navigate('NewMessage', { currentUser })}>
            <Text style={styles.dropdownText}>✏️ Nuevo Mensaje</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.dropdownItem} onPress={() => navigation.navigate('CreateGroup')}>
            <Text style={styles.dropdownText}>👥 Crear Grupo</Text>
          </TouchableOpacity>
        </View>
      )}

      {expanded === 'ajustes' && (
        <View style={styles.dropdown}>
          <TouchableOpacity style={[styles.dropdownItem]} onPress={logout}>
            <Text style={styles.dropdownExit}>🚪💨Cerrar Sesión</Text>
          </TouchableOpacity>
        </View>
      )}
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 20 },
  title: { fontSize: 28, fontWeight: 'bold', color: '#fff', textAlign: 'center', marginBottom: 20, marginTop: 40 },
  grid: { flexDirection: 'row', justifyContent: 'space-around', marginBottom: 15 },
  card: {
    flex: 1,
    backgroundColor: 'rgba(255,255,255,0.25)',
    padding: 20,
    marginHorizontal: 5,
    borderRadius: 15,
    alignItems: 'center',
  },
  cardText: { color: '#fff', fontWeight: 'bold', fontSize: 16, textAlign: 'center' },
  dropdown: {
    backgroundColor: 'rgba(255,255,255,0.15)',
    borderRadius: 12,
    padding: 10,
    marginHorizontal: 10,
    marginBottom: 10,
  },
  dropdownItem: {
    padding: 12,
    borderBottomColor: 'rgba(255,255,255,0.2)',
    borderBottomWidth: 1,
  },
  dropdownText: { color: '#fff', fontSize: 15, fontWeight: '600' },
  dropdownExit: { color: '#ff0000ff', fontSize: 17, fontWeight: '800' },
});