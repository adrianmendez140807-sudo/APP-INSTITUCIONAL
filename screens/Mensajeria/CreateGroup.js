import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, FlatList, TouchableOpacity, StyleSheet, Alert, ActivityIndicator } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import * as dbService from '../../database/messagingDatabase';

// screens/Mensajeria/CreateGroup.js
export function CreateGroup({ route, navigation }) {
  const { currentUser } = route.params;
  const [groupName, setGroupName] = useState('');
  const [users, setUsers] = useState([]);
  const [selectedMembers, setSelectedMembers] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadUsers();
  }, []);

  const loadUsers = async () => {
    try {
      const allUsers = await dbService.getUsers();
      const otherUsers = allUsers.filter(u => u.id !== currentUser.id);
      setUsers(otherUsers);
    } catch (error) {
      Alert.alert("Error", "No se pudieron cargar los usuarios");
    } finally {
      setLoading(false);
    }
  };

  const toggleMember = (userId) => {
    if (selectedMembers.includes(userId)) {
      setSelectedMembers(selectedMembers.filter(id => id !== userId));
    } else {
      setSelectedMembers([...selectedMembers, userId]);
    }
  };

  const handleCreateGroup = async () => {
    if (!groupName.trim()) {
      Alert.alert("Error", "Por favor ingresa un nombre para el grupo");
      return;
    }

    if (selectedMembers.length === 0) {
      Alert.alert("Error", "Por favor selecciona al menos un miembro");
      return;
    }

    try {
      const groupId = await dbService.createGroupConversation(
        groupName,
        currentUser.id,
        selectedMembers
      );

      const newGroup = {
        id: groupId,
        titulo: groupName,
        tipo: 'grupo',
        creador_id: currentUser.id,
        ultima_actividad: new Date().toISOString()
      };

      Alert.alert("Éxito", "Grupo creado correctamente", [
        {
          text: "Aceptar",
          onPress: () => navigation.navigate('ChatScreen', { 
            conversation: newGroup, 
            currentUser 
          })
        }
      ]);
    } catch (error) {
      Alert.alert("Error", "No se pudo crear el grupo");
      console.error(error);
    }
  };

  if (loading) {
    return (
      <View style={styles.centerContainer}>
        <ActivityIndicator size="large" color="#007bff" />
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <View style={styles.groupNameContainer}>
        <Text style={styles.label}>Nombre del Grupo</Text>
        <TextInput
          style={styles.groupNameInput}
          placeholder="Ej: Docentes de 10°A"
          value={groupName}
          onChangeText={setGroupName}
          placeholderTextColor="#999"
        />
      </View>

      <Text style={styles.membersTitle}>
        Seleccionar Miembros ({selectedMembers.length})
      </Text>

      <FlatList
        data={users}
        keyExtractor={(item) => item.id.toString()}
        renderItem={({ item }) => (
          <TouchableOpacity 
            style={styles.memberItem}
            onPress={() => toggleMember(item.id)}
          >
            <View style={styles.checkbox}>
              {selectedMembers.includes(item.id) && (
                <Ionicons name="checkmark" size={20} color="#007bff" />
              )}
            </View>
            <View style={styles.memberContent}>
              <Text style={styles.memberName}>{item.name}</Text>
              <Text style={styles.memberRole}>{item.role}</Text>
            </View>
          </TouchableOpacity>
        )}
      />

      <TouchableOpacity 
        style={[styles.createButton, !groupName.trim() && styles.disabledButton]}
        onPress={handleCreateGroup}
        disabled={!groupName.trim()}
      >
        <Ionicons name="checkmark-done" size={24} color="#fff" style={styles.buttonIcon} />
        <Text style={styles.createButtonText}>Crear Grupo</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#f8f9fa' },
  centerContainer: { flex: 1, justifyContent: 'center', alignItems: 'center' },
  searchContainer: { flexDirection: 'row', alignItems: 'center', backgroundColor: '#fff', margin: 10, borderRadius: 10, paddingHorizontal: 10, borderWidth: 1, borderColor: '#e9ecef' },
  searchIcon: { marginRight: 10 },
  searchInput: { flex: 1, height: 45, fontSize: 16, color: '#212529' },
  userItem: { flexDirection: 'row', alignItems: 'center', padding: 15, backgroundColor: '#fff', marginHorizontal: 10, marginVertical: 5, borderRadius: 10, borderWidth: 1, borderColor: '#e9ecef' },
  userAvatar: { marginRight: 15 },
  userContent: { flex: 1 },
  userName: { fontSize: 16, fontWeight: '600', color: '#212529' },
  userEmail: { fontSize: 14, color: '#6c757d', marginTop: 4 },
  userRole: { fontSize: 12, color: '#999', marginTop: 2, fontStyle: 'italic' },
  emptyContainer: { alignItems: 'center', justifyContent: 'center', paddingVertical: 100 },
  emptyText: { fontSize: 16, color: '#999', marginTop: 10 },
  groupNameContainer: { padding: 20, backgroundColor: '#fff', borderBottomWidth: 1, borderBottomColor: '#e9ecef' },
  label: { fontSize: 14, fontWeight: '600', color: '#495057', marginBottom: 8 },
  groupNameInput: { backgroundColor: '#f8f9fa', borderWidth: 1, borderColor: '#e9ecef', borderRadius: 8, paddingHorizontal: 12, paddingVertical: 10, fontSize: 16, color: '#212529' },
  membersTitle: { fontSize: 16, fontWeight: '600', color: '#495057', padding: 15, paddingBottom: 10 },
  memberItem: { flexDirection: 'row', alignItems: 'center', padding: 12, backgroundColor: '#fff', marginHorizontal: 10, marginVertical: 4, borderRadius: 8, borderWidth: 1, borderColor: '#e9ecef' },
  checkbox: { width: 24, height: 24, borderRadius: 6, borderWidth: 2, borderColor: '#007bff', justifyContent: 'center', alignItems: 'center', marginRight: 12 },
  memberContent: { flex: 1 },
  memberName: { fontSize: 15, fontWeight: '500', color: '#212529' },
  memberRole: { fontSize: 13, color: '#6c757d', marginTop: 3 },
  createButton: { flexDirection: 'row', backgroundColor: '#28a745', margin: 15, paddingVertical: 15, borderRadius: 10, justifyContent: 'center', alignItems: 'center' },
  disabledButton: { backgroundColor: '#ccc' },
  buttonIcon: { marginRight: 8 },
  createButtonText: { fontSize: 16, fontWeight: 'bold', color: '#fff' },
});