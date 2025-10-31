import React, { useState, useEffect, useCallback } from 'react';
import { View, Text, StyleSheet, FlatList, TextInput, Button, Alert, TouchableOpacity, Platform } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import dbService from '../../../database';
import Checkbox from 'expo-checkbox';
import DateTimePicker from '@react-native-community/datetimepicker';
import { Swipeable } from 'react-native-gesture-handler';
import { Ionicons } from '@expo/vector-icons';

export default function Apuntes() {
  const [tasks, setTasks] = useState([]);
  const [currentUser, setCurrentUser] = useState(null);
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [date, setDate] = useState(new Date());
  const [showDatePicker, setShowDatePicker] = useState(false);

  const loadTasks = useCallback(async (userId) => {
    if (!userId) return;
    const userTasks = await dbService.getTasks(userId);
    setTasks(userTasks);
  }, []);

  useEffect(() => {
    const getUser = async () => {
      const userString = await AsyncStorage.getItem('currentUser');
      if (userString) {
        const user = JSON.parse(userString);
        setCurrentUser(user);
        loadTasks(user.id);
      }
    };
    getUser();
  }, [loadTasks]);

  const handleAddTask = async () => {
    if (!title) {
      Alert.alert('Error', 'El título de la tarea es obligatorio.');
      return;
    }
    const formatDate = (d) => `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`;
    const newTask = {
      student_id: currentUser.id,
      titulo: title,
      descripcion: description,
      fecha_entrega: formatDate(date),
    };
    await dbService.addOrUpdateTask(newTask);
    setTitle('');
    setDescription('');
    loadTasks(currentUser.id);
  };

  const handleToggleTask = async (taskId, currentValue) => {
    await dbService.toggleTaskCompleted(taskId, !currentValue);
    loadTasks(currentUser.id);
  };

  const handleDeleteTask = async (taskId) => {
    await dbService.deleteTask(taskId);
    loadTasks(currentUser.id);
  };

  const onDateChange = (event, selectedDate) => {
    const currentDate = selectedDate || date;
    setShowDatePicker(Platform.OS === 'ios');
    setDate(currentDate);
  };

  const renderRightActions = (taskId) => (
    <TouchableOpacity onPress={() => handleDeleteTask(taskId)} style={styles.deleteBox}>
      <Ionicons name="trash-outline" size={24} color="#fff" />
    </TouchableOpacity>
  );

  const renderItem = ({ item }) => (
    <Swipeable renderRightActions={() => renderRightActions(item.id)}>
      <View style={styles.taskItem}>
        <Checkbox
          value={item.completada === 1}
          onValueChange={() => handleToggleTask(item.id, item.completada === 1)}
          color={item.completada ? '#4CAF50' : undefined}
        />
        <View style={styles.taskTextContainer}>
          <Text style={[styles.taskTitle, item.completada && styles.taskCompleted]}>{item.titulo}</Text>
          <Text style={styles.taskDate}>Entrega: {item.fecha_entrega}</Text>
          {item.descripcion ? <Text style={styles.taskDescription}>{item.descripcion}</Text> : null}
        </View>
      </View>
    </Swipeable>
  );

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Mis Talleres y Tareas</Text>
      <View style={styles.formContainer}>
        <TextInput style={styles.input} placeholder="Título de la tarea" value={title} onChangeText={setTitle} />
        <TextInput style={styles.input} placeholder="Descripción (opcional)" value={description} onChangeText={setDescription} />
        <TouchableOpacity onPress={() => setShowDatePicker(true)} style={styles.dateTouchable}>
          <Text>Fecha de Entrega: {date.toLocaleDateString()}</Text>
        </TouchableOpacity>
        {showDatePicker && (
          <DateTimePicker value={date} mode="date" display="default" onChange={onDateChange} />
        )}
        <Button title="Añadir Tarea" onPress={handleAddTask} />
      </View>
      <FlatList
        data={tasks}
        renderItem={renderItem}
        keyExtractor={(item) => item.id.toString()}
        ListEmptyComponent={<Text style={styles.emptyText}>¡No tienes tareas pendientes!</Text>}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#f8f9fa', padding: 15 },
  title: { fontSize: 26, fontWeight: 'bold', marginBottom: 15, textAlign: 'center' },
  formContainer: { backgroundColor: '#fff', padding: 15, borderRadius: 10, marginBottom: 20, elevation: 2 },
  input: { borderWidth: 1, borderColor: '#ccc', padding: 10, borderRadius: 5, marginBottom: 10 },
  dateTouchable: { padding: 10, borderWidth: 1, borderColor: '#ccc', borderRadius: 5, marginBottom: 10, alignItems: 'center' },
  taskItem: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#fff',
    padding: 15,
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
  },
  taskTextContainer: { marginLeft: 15, flex: 1 },
  taskTitle: { fontSize: 18, fontWeight: '500' },
  taskCompleted: { textDecorationLine: 'line-through', color: '#aaa' },
  taskDate: { fontSize: 12, color: '#888', marginTop: 2 },
  taskDescription: { fontSize: 14, color: '#555', marginTop: 5 },
  emptyText: { textAlign: 'center', marginTop: 40, color: '#888' },
  deleteBox: {
    backgroundColor: 'red',
    justifyContent: 'center',
    alignItems: 'center',
    width: 80,
    height: '100%',
  },
});
