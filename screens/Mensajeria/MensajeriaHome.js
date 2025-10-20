// screens/Mensajeria/MensajeriaHome.js
import React, { useState, useEffect, useCallback } from 'react';
import { View, Text, FlatList, TouchableOpacity, StyleSheet, Alert, TextInput, ActivityIndicator } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import AsyncStorage from '@react-native-async-storage/async-storage';
import dbService from '../../database';

export default function MensajeriaHome({ navigation }) {
  const [currentUser, setCurrentUser] = useState(null);
  const [conversations, setConversations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [unreadCount, setUnreadCount] = useState(0);

  useEffect(() => {
    loadUserAndConversations();
  }, []);

  useEffect(() => {
    const unsubscribe = navigation.addListener('focus', () => {
      loadUserAndConversations();
    });
    return unsubscribe;
  }, [navigation]);

  const loadUserAndConversations = async () => {
    try {
      const userStr = await AsyncStorage.getItem('currentUser');
      if (userStr) {
        const user = JSON.parse(userStr);
        setCurrentUser(user);
        
        const convs = await dbService.getConversationsForUser(user.id);
        setConversations(convs || []);
        
        const unread = await dbService.getUnreadMessageCount(user.id);
        setUnreadCount(unread);
      }
    } catch (error) {
      console.error("Error al cargar conversaciones:", error);
      Alert.alert("Error", "No se pudieron cargar las conversaciones");
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  const handleRefresh = () => {
    setRefreshing(true);
    loadUserAndConversations();
  };

  const handleConversationPress = (conversation) => {
    navigation.navigate('ChatScreen', { conversation, currentUser });
  };

  const handleNewMessage = () => {
    navigation.navigate('NewMessage', { currentUser });
  };

  const handleNewGroup = () => {
    navigation.navigate('CreateGroup', { currentUser });
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
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Mensajes</Text>
        <View style={styles.headerActions}>
          <TouchableOpacity style={styles.headerButton} onPress={handleNewMessage}>
            <Ionicons name="create-outline" size={24} color="#fff" />
          </TouchableOpacity>
          <TouchableOpacity style={styles.headerButton} onPress={handleNewGroup}>
            <Ionicons name="people-outline" size={24} color="#fff" />
          </TouchableOpacity>
        </View>
      </View>

      {unreadCount > 0 && (
        <View style={styles.unreadBanner}>
          <Ionicons name="information-circle" size={20} color="#fff" />
          <Text style={styles.unreadText}>Tienes {unreadCount} mensaje(s) sin leer</Text>
        </View>
      )}

      <FlatList
        data={conversations}
        keyExtractor={(item) => item.id}
        refreshing={refreshing}
        onRefresh={handleRefresh}
        renderItem={({ item }) => (
          <ConversationItem 
            conversation={item} 
            onPress={() => handleConversationPress(item)}
          />
        )}
        ListEmptyComponent={
          <View style={styles.emptyContainer}>
            <Ionicons name="chatbubbles-outline" size={64} color="#ccc" />
            <Text style={styles.emptyText}>No hay conversaciones</Text>
            <Text style={styles.emptySubtext}>Comienza una nueva conversación</Text>
          </View>
        }
      />
    </View>
  );
}

const ConversationItem = ({ conversation, onPress }) => {
  const [lastMessage, setLastMessage] = useState('');

  useEffect(() => {
    const getLastMessage = async () => {
      const msgs = await dbService.getMessagesFromConversation(conversation.id, 1);
      if (msgs.length > 0) {
        setLastMessage(msgs[0].content.substring(0, 50));
      }
    };
    getLastMessage();
  }, [conversation.id]);

  return (
    <TouchableOpacity style={styles.conversationItem} onPress={onPress}>
      <View style={styles.conversationAvatar}>
        <Ionicons 
          name={conversation.tipo === 'grupo' ? 'people' : 'person'} 
          size={32} 
          color="#007bff" 
        />
      </View>
      <View style={styles.conversationContent}>
        <Text style={styles.conversationTitle}>{conversation.titulo}</Text>
        <Text style={styles.conversationPreview} numberOfLines={1}>
          {lastMessage || 'Sin mensajes aún'}
        </Text>
      </View>
      <Text style={styles.conversationDate}>
        {new Date(conversation.ultima_actividad).toLocaleDateString()}
      </Text>
    </TouchableOpacity>
  );
};

// screens/Mensajeria/ChatScreen.js
export function ChatScreen({ route, navigation }) {
  const { conversation, currentUser } = route.params;
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadMessages();
    markAsRead();
  }, [conversation.id]);

  const loadMessages = async () => {
    try {
      const msgs = await dbService.getMessagesFromConversation(conversation.id);
      setMessages(msgs || []);
    } catch (error) {
      Alert.alert("Error", "No se pudieron cargar los mensajes");
    } finally {
      setLoading(false);
    }
  };

  const markAsRead = async () => {
    await dbService.markMessagesAsRead(conversation.id, currentUser.id);
  };

  const handleSendMessage = async () => {
    if (!newMessage.trim()) return;

    try {
      if (conversation.tipo === 'privada') {
        const recipientId = await getOtherUserId();
        await dbService.sendDirectMessage(currentUser.id, recipientId, newMessage);
      } else {
        await dbService.sendGroupMessage(currentUser.id, conversation.id, newMessage);
      }
      setNewMessage('');
      loadMessages();
    } catch (error) {
      Alert.alert("Error", "No se pudo enviar el mensaje");
    }
  };

  const getOtherUserId = async () => {
    const members = await db.getAllAsync(
      "SELECT user_id FROM miembros_conversacion WHERE conversation_id = ? AND user_id != ?",
      [conversation.id, currentUser.id]
    );
    return members[0]?.user_id;
  };

  if (loading) {
    return (
      <View style={styles.centerContainer}>
        <ActivityIndicator size="large" color="#007bff" />
      </View>
    );
  }

  return (
    <View style={styles.chatContainer}>
      <FlatList
        data={messages}
        keyExtractor={(item) => item.id.toString()}
        renderItem={({ item }) => (
          <MessageBubble 
            message={item} 
            isOwn={item.sender_id === currentUser.id}
          />
        )}
        inverted
      />
      <View style={styles.inputContainer}>
        <TextInput
          style={styles.messageInput}
          placeholder="Escribe un mensaje..."
          value={newMessage}
          onChangeText={setNewMessage}
          multiline
        />
        <TouchableOpacity 
          style={styles.sendButton} 
          onPress={handleSendMessage}
        >
          <Ionicons name="send" size={24} color="#fff" />
        </TouchableOpacity>
      </View>
    </View>
  );
}

const MessageBubble = ({ message, isOwn }) => {
  return (
    <View style={[styles.messageBubbleContainer, isOwn && styles.ownMessage]}>
      <View style={[styles.messageBubble, isOwn && styles.ownBubble]}>
        <Text style={styles.messageText}>{message.content}</Text>
        <Text style={styles.messageTime}>
          {new Date(message.fecha).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
        </Text>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#f8f9fa' },
  centerContainer: { flex: 1, justifyContent: 'center', alignItems: 'center' },
  header: { backgroundColor: '#007bff', padding: 15, flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  headerTitle: { fontSize: 24, fontWeight: 'bold', color: '#fff' },
  headerActions: { flexDirection: 'row', gap: 10 },
  headerButton: { padding: 8 },
  unreadBanner: { backgroundColor: '#ff6b6b', padding: 12, flexDirection: 'row', alignItems: 'center', gap: 10 },
  unreadText: { color: '#fff', fontSize: 14, fontWeight: '500' },
  conversationItem: { flexDirection: 'row', padding: 15, borderBottomWidth: 1, borderBottomColor: '#e9ecef', alignItems: 'center' },
  conversationAvatar: { width: 50, height: 50, borderRadius: 25, backgroundColor: '#e9ecef', justifyContent: 'center', alignItems: 'center', marginRight: 12 },
  conversationContent: { flex: 1 },
  conversationTitle: { fontSize: 16, fontWeight: 'bold', color: '#212529' },
  conversationPreview: { fontSize: 14, color: '#6c757d', marginTop: 4 },
  conversationDate: { fontSize: 12, color: '#999' },
  emptyContainer: { alignItems: 'center', justifyContent: 'center', paddingVertical: 100 },
  emptyText: { fontSize: 18, fontWeight: 'bold', color: '#999', marginTop: 10 },
  emptySubtext: { fontSize: 14, color: '#bbb', marginTop: 5 },
  chatContainer: { flex: 1, backgroundColor: '#fff' },
  inputContainer: { flexDirection: 'row', padding: 10, backgroundColor: '#f8f9fa', alignItems: 'flex-end', borderTopWidth: 1, borderTopColor: '#e9ecef' },
  messageInput: { flex: 1, backgroundColor: '#fff', borderRadius: 20, paddingHorizontal: 15, paddingVertical: 10, marginRight: 10, maxHeight: 100, borderWidth: 1, borderColor: '#e9ecef' },
  sendButton: { width: 40, height: 40, borderRadius: 20, backgroundColor: '#007bff', justifyContent: 'center', alignItems: 'center' },
  messageBubbleContainer: { flexDirection: 'row', padding: 10, justifyContent: 'flex-start' },
  ownMessage: { justifyContent: 'flex-end' },
  messageBubble: { backgroundColor: '#e9ecef', borderRadius: 15, padding: 10, maxWidth: '80%' },
  ownBubble: { backgroundColor: '#007bff' },
  messageText: { color: '#212529', fontSize: 14 },
  messageTime: { fontSize: 12, color: '#999', marginTop: 5, textAlign: 'right' },
});