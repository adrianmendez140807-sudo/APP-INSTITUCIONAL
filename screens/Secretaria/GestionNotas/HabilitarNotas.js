import React, { useState, useEffect } from 'react';
import { View, Text, Switch, StyleSheet, Alert } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';

const SETTINGS_KEYS = {
  TEACHER_EDITING: '@settings_teacher_editing_enabled',
  STUDENT_VIEWING: '@settings_student_viewing_enabled',
};

export default function HabilitarNotas() {
  const [isTeacherEditingEnabled, setIsTeacherEditingEnabled] = useState(true);
  const [isStudentViewingEnabled, setIsStudentViewingEnabled] = useState(true);
  const [isLoading, setIsLoading] = useState(true);

  // Cargar configuraciones al montar el componente
  useEffect(() => {
    const loadSettings = async () => {
      try {
        const teacherSetting = await AsyncStorage.getItem(SETTINGS_KEYS.TEACHER_EDITING);
        const studentSetting = await AsyncStorage.getItem(SETTINGS_KEYS.STUDENT_VIEWING);

        // Si no se encuentra una configuración, se asume como verdadera (habilitado)
        if (teacherSetting !== null) {
          setIsTeacherEditingEnabled(JSON.parse(teacherSetting));
        }
        if (studentSetting !== null) {
          setIsStudentViewingEnabled(JSON.parse(studentSetting));
        }
      } catch (e) {
        Alert.alert("Error", "No se pudieron cargar las configuraciones.");
        console.error("Failed to load settings.", e);
      } finally {
        setIsLoading(false);
      }
    };

    loadSettings();
  }, []);

  const handleTeacherToggle = async (newValue) => {
    setIsTeacherEditingEnabled(newValue);
    try {
      await AsyncStorage.setItem(SETTINGS_KEYS.TEACHER_EDITING, JSON.stringify(newValue));
    } catch (e) {
      Alert.alert("Error", "No se pudo guardar la configuración.");
    }
  };

  const handleStudentToggle = async (newValue) => {
    setIsStudentViewingEnabled(newValue);
    try {
      await AsyncStorage.setItem(SETTINGS_KEYS.STUDENT_VIEWING, JSON.stringify(newValue));
    } catch (e) {
      Alert.alert("Error", "No se pudo guardar la configuración.");
    }
  };

  if (isLoading) {
    return (
      <View style={styles.container}>
        <Text>Cargando configuraciones...</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Gestión de Permisos de Notas</Text>
      <Text style={styles.description}>
        Controla los permisos de edición y visualización de notas para docentes y estudiantes.
      </Text>

      <View style={styles.optionContainer}>
        <View style={styles.textContainer}>
          <Text style={styles.optionTitle}>Edición de Notas para Docentes</Text>
          <Text style={styles.optionDescription}>
            {isTeacherEditingEnabled ? 'Habilitado: Los docentes pueden modificar las notas.' : 'Deshabilitado: Los docentes no pueden modificar las notas.'}
          </Text>
        </View>
        <Switch trackColor={{ false: '#767577', true: '#81b0ff' }} thumbColor={isTeacherEditingEnabled ? '#f5dd4b' : '#f4f3f4'} onValueChange={handleTeacherToggle} value={isTeacherEditingEnabled} />
      </View>

      <View style={styles.optionContainer}>
        <View style={styles.textContainer}>
          <Text style={styles.optionTitle}>Visualización de Notas para Estudiantes</Text>
          <Text style={styles.optionDescription}>
            {isStudentViewingEnabled ? 'Habilitado: Los estudiantes pueden ver sus notas.' : 'Deshabilitado: Los estudiantes no pueden ver sus notas.'}
          </Text>
        </View>
        <Switch trackColor={{ false: '#767577', true: '#81b0ff' }} thumbColor={isStudentViewingEnabled ? '#f5dd4b' : '#f4f'} onValueChange={handleStudentToggle} value={isStudentViewingEnabled} />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: '#f8f9fa',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 10,
    color: '#343a40',
  },
  description: {
    fontSize: 16,
    color: '#6c757d',
    marginBottom: 30,
  },
  optionContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 20,
    paddingHorizontal: 15,
    backgroundColor: '#ffffff',
    borderRadius: 10,
    marginBottom: 15,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 3.84,
    elevation: 5,
  },
  textContainer: {
    flex: 1,
    marginRight: 15,
  },
  optionTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#495057',
  },
  optionDescription: {
    fontSize: 14,
    color: '#6c757d',
    marginTop: 5,
  },
});
