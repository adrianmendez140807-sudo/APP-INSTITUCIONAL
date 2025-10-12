// screens/Secretaria/SecretariaHome.js
import React, { useState } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, LayoutAnimation, Platform, UIManager } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { LinearGradient } from 'expo-linear-gradient';

if (Platform.OS === 'android' && UIManager.setLayoutAnimationEnabledExperimental) {
  UIManager.setLayoutAnimationEnabledExperimental(true);
}

export default function DocenteHome({ navigation }) {
  const [expanded, setExpanded] = useState(null);

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
          <TouchableOpacity style={styles.dropdownItem} onPress={() => navigation.navigate('Estudiante')}>
            <Text style={styles.dropdownText}>➕ Agregar Estudiante</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.dropdownItem} onPress={() => navigation.navigate('ListaEstudiantes')}>
            <Text style={styles.dropdownText}>📋 Lista de Estudiantes</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.dropdownItem} onPress={() => navigation.navigate('BaseDatosEstudiantes')}>
            <Text style={styles.dropdownText}>🗃️ Base de Datos de Estudiantes</Text>
          </TouchableOpacity>
        </View>
      )}

      {expanded === 'materias' && (
        <View style={styles.dropdown}>
          <TouchableOpacity style={styles.dropdownItem} onPress={() => navigation.navigate('AgregarDocente')}>
            <Text style={styles.dropdownText}>➕ Agregar Docente</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.dropdownItem} onPress={() => navigation.navigate('ListaDocentes')}>
            <Text style={styles.dropdownText}>📋 Lista de Docentes</Text>
          </TouchableOpacity>
        </View>
      )}

      {expanded === 'notas' && (
        <View style={styles.dropdown}>
          <TouchableOpacity style={styles.dropdownItem} onPress={() => navigation.navigate('HabilitarNotas')}>
            <Text style={styles.dropdownText}>✅ Habilitar Notas</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.dropdownItem} onPress={() => navigation.navigate('DeshabilitarNotas')}>
            <Text style={styles.dropdownText}>🚫 Deshabilitar Notas</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.dropdownItem} onPress={() => navigation.navigate('GestionNotas')}>
            <Text style={styles.dropdownText}>📑 Gestion de notas por usuario</Text>
          </TouchableOpacity>
        </View>
      )}

      {expanded === 'documentos' && (
        <View style={styles.dropdown}>
          <TouchableOpacity style={styles.dropdownItem} onPress={() => navigation.navigate('GestionarLibros')}>
            <Text style={styles.dropdownText}>📚 Gestionar Libros</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.dropdownItem} onPress={() => navigation.navigate('ArchivosDigitales')}>
            <Text style={styles.dropdownText}>📑 Archivos Digitales</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.dropdownItem} onPress={() => navigation.navigate('DocumentosOficiales')}>
            <Text style={styles.dropdownText}>📂 Documentos Oficiales</Text>
          </TouchableOpacity>
        </View>
      )}

      {expanded === 'reportes' && (
        <View style={styles.dropdown}>
          <TouchableOpacity style={styles.dropdownItem} onPress={() => navigation.navigate('GenerarReportes')}>
            <Text style={styles.dropdownText}>📊 Generar Reportes</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.dropdownItem} onPress={() => navigation.navigate('ReportesAsistencias')}>
            <Text style={styles.dropdownText}>📅 Reporte de Asistencia</Text>
          </TouchableOpacity>
        </View>
      )}

      {expanded === 'comunicacion' && (
        <View style={styles.dropdown}>
          <TouchableOpacity style={styles.dropdownItem} onPress={() => navigation.navigate('CircularesAvisos')}>
            <Text style={styles.dropdownText}>📢 Circulares y Avisos</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.dropdownItem} onPress={() => navigation.navigate('MensajesEstudiantes')}>
            <Text style={styles.dropdownText}>💬 Mensajes a Estudiantes</Text>
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
