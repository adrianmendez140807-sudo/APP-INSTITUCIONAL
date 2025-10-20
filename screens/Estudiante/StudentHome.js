// screens/Secretaria/SecretariaHome.js
import React, { useState, useEffect } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, LayoutAnimation, Platform, UIManager } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { LinearGradient } from 'expo-linear-gradient';

if (Platform.OS === 'android' && UIManager.setLayoutAnimationEnabledExperimental) {
  UIManager.setLayoutAnimationEnabledExperimental(true);
}

export default function StudentHome({ navigation }) {
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
      <Text style={styles.title}>Pantalla principal de estudiante</Text>

      <View style={styles.grid}>
        {/* Estudiantes */}
        <TouchableOpacity style={styles.card} onPress={() => toggleExpand('docentes de estudiantes')}>
          <Text style={styles.cardText}>Docentes</Text>
        </TouchableOpacity>

        {/* Docentes */}
        <TouchableOpacity style={styles.card} onPress={() => toggleExpand('Grupos')}>
          <Text style={styles.cardText}>Grupos</Text>
        </TouchableOpacity>
      </View>

      <View style={styles.grid}>
        {/* Notas */}
        <TouchableOpacity style={styles.card} onPress={() => toggleExpand('Materias por docentes')}>
          <Text style={styles.cardText}>Materias por docentes</Text>
        </TouchableOpacity>

        {/* Documentos */}
        <TouchableOpacity style={styles.card} onPress={() => toggleExpand('Horario')}>
          <Text style={styles.cardText}>Horario</Text>
        </TouchableOpacity>
      </View>

      <View style={styles.grid}>
        {/* Reportes */}
        <TouchableOpacity style={styles.card} onPress={() => toggleExpand('Actividades')}>
          <Text style={styles.cardText}>Actividades e informaciones</Text>
        </TouchableOpacity>

        {/* Comunicación */}
        <TouchableOpacity style={styles.card} onPress={() => toggleExpand('Notas')}>
          <Text style={styles.cardText}>Comunicacion</Text>
        </TouchableOpacity>
      </View>

      {/* Ajustes */}
      <View style={styles.grid}>
        <TouchableOpacity style={[styles.card, { backgroundColor: 'rgba(96, 68, 255, 0.7)' }]} onPress={() => toggleExpand('ajustes')}>
          <Text style={styles.cardText}>Ajustes</Text>
        </TouchableOpacity>
      </View>

      {/* Sub-opciones dinámicas */}
      {expanded === 'docentes de estudiantes' && (
        <View style={styles.dropdown}>
          <TouchableOpacity style={styles.dropdownItem} onPress={() => navigation.navigate('Estudiante')}>
            <Text style={styles.dropdownText}>Listado completo de docentes</Text>
          </TouchableOpacity>
        </View>
      )}

      {expanded === 'Grupos' && (
        <View style={styles.dropdown}>
          <TouchableOpacity style={styles.dropdownItem} onPress={() => navigation.navigate('AgregarDocente')}>
            <Text style={styles.dropdownText}>💬Docente + Materia</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.dropdownItem} onPress={() => navigation.navigate('ListaDocentes')}>
            <Text style={styles.dropdownText}>💬Solo estudiantes</Text>
          </TouchableOpacity>
        </View>
      )}

      {expanded === 'Materias por docentes' && (
        <View style={styles.dropdown}>
          <TouchableOpacity style={styles.dropdownItem} onPress={() => navigation.navigate('HabilitarNotas')}>
            <Text style={styles.dropdownText}>Materias por docentes</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.dropdownItem} onPress={() => navigation.navigate('DeshabilitarNotas')}>
            <Text style={styles.dropdownText}>Total de Materias + NF</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.dropdownItem} onPress={() => navigation.navigate('GestionNotas')}>
            <Text style={styles.dropdownText}>Notas</Text>
          </TouchableOpacity>
        </View>
      )}

      {expanded === 'Horario' && (
        <View style={styles.dropdown}>
          <TouchableOpacity style={styles.dropdownItem} onPress={() => navigation.navigate('GestionarLibros')}>
            <Text style={styles.dropdownText}>📅 Horario General</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.dropdownItem} onPress={() => navigation.navigate('ArchivosDigitales')}>
            <Text style={styles.dropdownText}>📅 Cambios de horario</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.dropdownItem} onPress={() => navigation.navigate('DocumentosOficiales')}>
            <Text style={styles.dropdownText}>Razones</Text>
          </TouchableOpacity>
        </View>
      )}

      {expanded === 'Actividades' && (
        <View style={styles.dropdown}>
          <TouchableOpacity style={styles.dropdownItem} onPress={() => navigation.navigate('GenerarReportes')}>
            <Text style={styles.dropdownText}>📅 informaciones</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.dropdownItem} onPress={() => navigation.navigate('ReportesAsistencias')}>
            <Text style={styles.dropdownText}>📅 Aviso de actividades</Text>
          </TouchableOpacity>
        </View>
      )}

      {expanded === 'Notas' && (
        <View style={styles.dropdown}>
          <TouchableOpacity style={styles.dropdownItem} onPress={() => navigation.navigate('CircularesAvisos')}>
            <Text style={styles.dropdownText}>📢 Notas importantes de clase</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.dropdownItem} onPress={() => navigation.navigate('MensajesEstudiantes')}>
            <Text style={styles.dropdownText}>📢 Talleres y tareas</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.dropdownItem} onPress={() => navigation.navigate('MensajeriaHome')}>
            <Text style={styles.dropdownText}>📬 Bandeja de Entrada</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.dropdownItem} onPress={() => navigation.navigate('NewMessage', { currentUser })}>
            <Text style={styles.dropdownText}>✏️ Nuevo Mensaje</Text>
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