import React, { useState, useEffect, useCallback } from 'react';
import { View, Text, StyleSheet, FlatList, TouchableOpacity, Alert, ActivityIndicator } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import AsyncStorage from '@react-native-async-storage/async-storage';
import dbService from '../../../database';

function NoteEditor({ note, onSave, onCancel, onDelete }) {
  const [content, setContent] = useState(note.contenido || '');

  const handleSave = () => {
    const firstLine = content.split('\n')[0] || 'Nueva Nota';
    onSave({ ...note, titulo: firstLine, contenido: content });
  };

  return (
    <View style={styles.editorContainer}>
      <View style={styles.editorHeader}>
        <TouchableOpacity onPress={onCancel}>
          <Ionicons name="chevron-back" size={32} color="#007bff" />
        </TouchableOpacity>
        <TouchableOpacity onPress={handleSave}>
          <Text style={styles.editorButtonText}>Guardar</Text>
        </TouchableOpacity>
        {note.id && (
          <TouchableOpacity onPress={() => onDelete(note.id)}>
            <Ionicons name="trash-outline" size={24} color="#dc3545" />
          </TouchableOpacity>
        )}
      </View>
      <TextInput
        style={styles.editorInput}
        multiline
        autoFocus
        value={content}
        onChangeText={setContent}
        placeholder="Escribe tu nota aquí..."
      />
    </View>
  );
}

export default function NotasImportantes() {
  const [notes, setNotes] = useState([]);
  const [currentUser, setCurrentUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [editingNote, setEditingNote] = useState(null);

  const loadNotes = useCallback(async (userId) => {
    if (!userId) return;
    setLoading(true);
    const userNotes = await dbService.getPersonalNotes(userId);
    setNotes(userNotes);
    setLoading(false);
  }, []);

  useEffect(() => {
    const getUser = async () => {
      const userString = await AsyncStorage.getItem('currentUser');
      if (userString) {
        const user = JSON.parse(userString);
        setCurrentUser(user);
        loadNotes(user.id);
      } else {
        setLoading(false);
      }
    };
    getUser();
  }, [loadNotes]);

  const handleSaveNote = async (noteToSave) => {
    await dbService.addOrUpdatePersonalNote(noteToSave);
    setEditingNote(null);
    loadNotes(currentUser.id);
  };

  const handleDeleteNote = async (noteId) => {
    Alert.alert('Eliminar Nota', '¿Estás seguro de que quieres eliminar esta nota?', [
      { text: 'Cancelar', style: 'cancel' },
      {
        text: 'Eliminar',
        style: 'destructive',
        onPress: async () => {
          await dbService.deletePersonalNote(noteId);
          setEditingNote(null);
          loadNotes(currentUser.id);
        },
      },
    ]);
  };

  const handleAddNewNote = () => {
    setEditingNote({ student_id: currentUser.id, titulo: '', contenido: '' });
  };

  if (editingNote) {
    return (
      <NoteEditor
        note={editingNote}
        onSave={handleSaveNote}
        onCancel={() => setEditingNote(null)}
        onDelete={handleDeleteNote}
      />
    );
  }

  const renderItem = ({ item }) => (
    <TouchableOpacity style={styles.noteItem} onPress={() => setEditingNote(item)}>
      <Text style={styles.noteTitle}>{item.titulo}</Text>
      <Text style={styles.noteExcerpt} numberOfLines={2}>{item.contenido}</Text>
    </TouchableOpacity>
  );

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Mis Notas de Clase</Text>
      {loading ? (
        <ActivityIndicator size="large" />
      ) : (
        <FlatList
          data={notes}
          renderItem={renderItem}
          keyExtractor={(item) => item.id.toString()}
          ListEmptyComponent={<Text style={styles.emptyText}>No tienes notas. ¡Crea una!</Text>}
        />
      )}
      <TouchableOpacity style={styles.fab} onPress={handleAddNewNote}>
        <Ionicons name="add" size={32} color="#fff" />
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#f8f9fa', padding: 15 },
  title: { fontSize: 26, fontWeight: 'bold', marginBottom: 20, textAlign: 'center' },
  noteItem: { backgroundColor: '#fff', padding: 15, borderRadius: 10, marginBottom: 10, elevation: 2 },
  noteTitle: { fontSize: 18, fontWeight: 'bold' },
  noteExcerpt: { fontSize: 14, color: '#6c757d', marginTop: 5 },
  emptyText: { textAlign: 'center', marginTop: 50, color: '#888' },
  fab: { position: 'absolute', right: 30, bottom: 30, backgroundColor: '#007bff', width: 60, height: 60, borderRadius: 30, justifyContent: 'center', alignItems: 'center', elevation: 5 },
  editorContainer: { flex: 1, paddingTop: 40, paddingHorizontal: 15 },
  editorHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 15 },
  editorButtonText: { fontSize: 18, color: '#007bff', fontWeight: '600' },
  editorInput: { flex: 1, fontSize: 18, textAlignVertical: 'top' },
});

const { TextInput } = require('react-native'); // Para evitar un error de importación circular en algunos entornos
