// screens/Mensajeria/NewMessage.js
import React, { useState, useEffect } from 'react';
import { View, Text, FlatList, TouchableOpacity, StyleSheet, Alert, TextInput, ActivityIndicator } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import dbService from '../../database';

export default function NewMessage({ route, navigation }) {
  const { currentUser } = route.params;
  const [users, setUsers] = useState([]);
  const [filteredUsers, setFilteredUsers] = useState([]);
  const [searchText, setSearchText] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadUsers();
  }, []);

  const loadUsers = async () => {
    try {
      const allUsers = await dbService.getUsers();
      const otherUsers = allUsers.filter(u => u.id !== currentUser.id);
      setUsers(otherUsers);
      setFilteredUsers(otherUsers);
    } catch (error) {
      Alert.alert("Error", "No se pudieron cargar los usuarios");
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = (text) => {
    setSearchText(text);
    const filtered = users.filter(u => 
      u.name.toLowerCase().includes(text.toLowerCase()) ||
      u.email.toLowerCase().includes(text.toLowerCase())
    );
    setFilteredUsers(filtered);
  };

  const handleSelectUser = async (selectedUser) => {
    try {
      const conversationId = [currentUser.id, selectedUser.id].sort().join('_');
      
      // Verificar si la conversación ya existe
      const exists = await dbService.db.getFirstAsync(
        "SELECT id FROM conversaciones WHERE id = ?",
        [conversationId]
      );

      if (exists) {
        navigation.navigate('ChatScreen', { 
          conversation: exists, 
          currentUser 
        });
      } else {
        // Crear nueva conversación privada
        const newConvId = await dbService.createGroupConversation(
          `Chat con ${selectedUser.name}`,
          currentUser.id,
          [selectedUser.id]
        );
        
        const newConversation = {
          id: newConvId,
          titulo: `Chat con ${selectedUser.name}`,
          tipo: 'privada',
          creador_id: currentUser.id,
          ultima_actividad: new Date().toISOString()
        };

        navigation.navigate('ChatScreen', { 
          conversation: newConversation, 
          currentUser 
        });
      }
    } catch (error) {
      Alert.alert("Error", "No se pudo iniciar la conversación");
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
      <View style={styles.searchContainer}>
        <Ionicons name="search" size={20} color="#999" style={styles.searchIcon} />
        <TextInput
          style={styles.searchInput}
          placeholder="Buscar usuario..."
          value={searchText}
          onChangeText={handleSearch}
          placeholderTextColor="#999"
        />
        {searchText !== '' && (
          <TouchableOpacity onPress={() => handleSearch('')}>
            <Ionicons name="close" size={20} color="#999" />
          </TouchableOpacity>
        )}
      </View>

      <FlatList
        data={filteredUsers}
        keyExtractor={(item) => item.id.toString()}
        renderItem={({ item }) => (
          <TouchableOpacity 
            style={styles.userItem} 
            onPress={() => handleSelectUser(item)}
          >
            <View style={styles.userAvatar}>
              <Ionicons name="person-circle" size={50} color="#007bff" />
            </View>
            <View style={styles.userContent}>
              <Text style={styles.userName}>{item.name}</Text>
              <Text style={styles.userEmail}>{item.email}</Text>
              <Text style={styles.userRole}>{item.role}</Text>
            </View>
            <Ionicons name="chevron-forward" size={24} color="#999" />
          </TouchableOpacity>
        )}
        ListEmptyComponent={
          <View style={styles.emptyContainer}>
            <Ionicons name="person-outline" size={64} color="#ccc" />
            <Text style={styles.emptyText}>
              {searchText ? 'No se encontraron usuarios' : 'No hay usuarios disponibles'}
            </Text>
          </View>
        }
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f8f9fa',
  },
  centerContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#fff',
    margin: 10,
    borderRadius: 10,
    paddingHorizontal: 10,
    borderWidth: 1,
    borderColor: '#e9ecef',
  },
  searchIcon: {
    marginRight: 10,
  },
  searchInput: {
    flex: 1,
    height: 45,
    fontSize: 16,
    color: '#212529',
  },
  userItem: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 15,
    backgroundColor: '#fff',
    marginHorizontal: 10,
    marginVertical: 5,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: '#e9ecef',
  },
  userAvatar: {
    marginRight: 15,
  },
  userContent: {
    flex: 1,
  },
  userName: {
    fontSize: 16,
    fontWeight: '600',
    color: '#212529',
  },
  userEmail: {
    fontSize: 14,
    color: '#6c757d',
    marginTop: 4,
  },
  userRole: {
    fontSize: 12,
    color: '#999',
    marginTop: 2,
    fontStyle: 'italic',
  },
  emptyContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 100,
  },
  emptyText: {
    fontSize: 16,
    color: '#999',
    marginTop: 10,
  },
});