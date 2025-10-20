// screens/Mensajeria/ChatScreen.js
import React, { useState, useEffect, useRef } from 'react';
import {
  View,
  Text,
  FlatList,
  TouchableOpacity,
  StyleSheet,
  Alert,
  TextInput,
  ActivityIndicator,
  KeyboardAvoidingView,
  Platform,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import dbService from '../../database/index';
import MessageBubble from '../../components/MessageBubble';

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f8f9fa',
  },
  centerContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#fff',
  },
  loadingText: {
    marginTop: 10,
    fontSize: 14,
    color: '#999',
  },
  chatContainer: {
    flex: 1,
    backgroundColor: '#fff',
  },
  headerRightButton: {
    paddingHorizontal: 15,
  },
  emptyContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 80,
  },
  emptyText: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#999',
    marginTop: 10,
  },
  emptySubtext: {
    fontSize: 14,
    color: '#bbb',
    marginTop: 5,
    textAlign: 'center',
    paddingHorizontal: 30,
  },
  inputContainer: {
    flexDirection: 'row',
    padding: 12,
    backgroundColor: '#f8f9fa',
    alignItems: 'flex-end',
    borderTopWidth: 1,
    borderTopColor: '#e9ecef',
    gap: 8,
  },
  inputWrapper: {
    flex: 1,
  },
  messageInput: {
    backgroundColor: '#fff',
    borderRadius: 20,
    paddingHorizontal: 15,
    paddingVertical: 10,
    fontSize: 14,
    color: '#212529',
    borderWidth: 1,
    borderColor: '#e9ecef',
    maxHeight: 100,
    minHeight: 40,
  },
  charCount: {
    fontSize: 11,
    color: '#999',
    marginTop: 4,
    marginLeft: 10,
  },
  sendButton: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: '#007bff',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 0,
  },
  sendButtonDisabled: {
    backgroundColor: '#ccc',
  },
});

export default function ChatScreen({ route, navigation }) {
  const { conversation, currentUser } = route.params;
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState('');
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [otherUser, setOtherUser] = useState(null);
  const [isSending, setIsSending] = useState(false);
  const flatListRef = useRef(null);

  // Cargar información inicial
  useEffect(() => {
    loadChatData();
    markAsRead();
    
    // Recargar mensajes cada 3 segundos
    const interval = setInterval(() => {
      loadMessages();
    }, 3000);

    return () => clearInterval(interval);
  }, [conversation.id, currentUser.id]);

  // Actualizar título del header
  useEffect(() => {
    navigation.setOptions({
      headerTitle: conversation.titulo,
      headerRight: () => (
        <TouchableOpacity style={styles.headerRightButton} onPress={handleMoreOptions}>
          <Ionicons name="ellipsis-vertical" size={24} color="#fff" />
        </TouchableOpacity>
      ),
    });
  }, [conversation]);

  const loadChatData = async () => {
    try {
      setLoading(true);
      
      // Cargar mensajes
      await loadMessages();
      
      // Si es conversación privada, obtener datos del otro usuario
      if (conversation.tipo === 'privada') {
        const members = await dbService.getConversationMembers(conversation.id);
        const otherMember = members.find(m => m.user_id !== currentUser.id);
        
        if (otherMember) {
          const user = await dbService.getUserById(otherMember.user_id);
          setOtherUser(user);
          
          // Actualizar nombre en header
          if (user) {
            navigation.setOptions({
              headerTitle: user.name,
            });
          }
        }
      }
    } catch (error) {
      console.error("Error cargando datos del chat:", error);
      Alert.alert("Error", "No se pudieron cargar los datos del chat");
    } finally {
      setLoading(false);
    }
  };

  const loadMessages = async () => {
    try {
      const msgs = await dbService.getMessagesFromConversation(conversation.id, 100);
      setMessages(msgs || []);
      
      // Scroll al final automáticamente
      setTimeout(() => {
        if (flatListRef.current && msgs && msgs.length > 0) {
          flatListRef.current.scrollToEnd({ animated: true });
        }
      }, 100);
    } catch (error) {
      console.error("Error cargando mensajes:", error);
    }
  };

  const markAsRead = async () => {
    try {
      await dbService.markMessagesAsRead(conversation.id, currentUser.id);
    } catch (error) {
      console.error("Error marcando como leído:", error);
    }
  };

  const handleRefresh = async () => {
    setRefreshing(true);
    await loadMessages();
    setRefreshing(false);
  };

  const handleSendMessage = async () => {
    if (!newMessage.trim()) {
      return;
    }

    const messageToSend = newMessage.trim();
    setNewMessage('');
    setIsSending(true);

    try {
      if (conversation.tipo === 'privada') {
        // Mensaje directo
        const members = await dbService.getConversationMembers(conversation.id);
        const recipientMember = members.find(m => m.user_id !== currentUser.id);

        if (!recipientMember) {
          Alert.alert("Error", "No se puede identificar el destinatario");
          setNewMessage(messageToSend);
          setIsSending(false);
          return;
        }

        await dbService.sendDirectMessage(
          currentUser.id,
          recipientMember.user_id,
          messageToSend
        );
      } else {
        // Mensaje de grupo
        await dbService.sendGroupMessage(
          currentUser.id,
          conversation.id,
          messageToSend
        );
      }

      // Recargar mensajes
      await loadMessages();
      console.log("✅ Mensaje enviado correctamente");
    } catch (error) {
      console.error("Error enviando mensaje:", error);
      Alert.alert("Error", "No se pudo enviar el mensaje");
      setNewMessage(messageToSend);
    } finally {
      setIsSending(false);
    }
  };

  const handleMoreOptions = () => {
    if (conversation.tipo === 'grupo') {
      Alert.alert(
        "Opciones del Grupo",
        "¿Qué deseas hacer?",
        [
          {
            text: "Ver Miembros",
            onPress: handleViewMembers,
          },
          {
            text: "Cancelar",
            style: "cancel",
          },
        ]
      );
    } else {
      Alert.alert(
        "Opciones",
        "¿Qué deseas hacer?",
        [
          {
            text: "Ver Perfil",
            onPress: handleViewProfile,
          },
          {
            text: "Cancelar",
            style: "cancel",
          },
        ]
      );
    }
  };

  const handleViewMembers = async () => {
    try {
      const members = await dbService.getConversationMembers(conversation.id);
      const memberNames = [];

      for (const member of members) {
        const user = await dbService.getUserById(member.user_id);
        if (user) {
          memberNames.push(`${user.name} (${user.role})`);
        }
      }

      Alert.alert(
        "Miembros del Grupo",
        memberNames.join('\n') || "No hay miembros",
        [{ text: "OK", style: "default" }]
      );
    } catch (error) {
      Alert.alert("Error", "No se pudieron cargar los miembros");
    }
  };

  const handleViewProfile = () => {
    if (otherUser) {
      Alert.alert(
        "Perfil de " + otherUser.name,
        `Nombre: ${otherUser.name}\nEmail: ${otherUser.email}\nRol: ${otherUser.role}\nDocumento: ${otherUser.documentNumber}`,
        [{ text: "OK", style: "default" }]
      );
    }
  };

  const handleDeleteMessage = (messageId) => {
    Alert.alert(
      "Eliminar Mensaje",
      "¿Estás seguro de que deseas eliminar este mensaje?",
      [
        {
          text: "Cancelar",
          style: "cancel",
        },
        {
          text: "Eliminar",
          onPress: async () => {
            try {
              await dbService.deleteMessage(messageId);
              await loadMessages();
              console.log("✅ Mensaje eliminado");
            } catch (error) {
              Alert.alert("Error", "No se pudo eliminar el mensaje");
            }
          },
          style: "destructive",
        },
      ]
    );
  };

  if (loading) {
    return (
      <View style={styles.centerContainer}>
        <ActivityIndicator size="large" color="#007bff" />
        <Text style={styles.loadingText}>Cargando chat...</Text>
      </View>
    );
  }

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      keyboardVerticalOffset={Platform.OS === 'ios' ? 90 : 0}
    >
      <View style={styles.chatContainer}>
        {/* Mensajes */}
        <FlatList
          ref={flatListRef}
          data={messages}
          keyExtractor={(item) => item.id.toString()}
          renderItem={({ item }) => (
            <MessageBubble
              message={item}
              isOwn={item.sender_id === currentUser.id}
              currentUserId={currentUser.id}
              onDelete={() => handleDeleteMessage(item.id)}
            />
          )}
          inverted
          refreshing={refreshing}
          onRefresh={handleRefresh}
          ListEmptyComponent={
            <View style={styles.emptyContainer}>
              <Ionicons name="chatbubbles-outline" size={64} color="#ccc" />
              <Text style={styles.emptyText}>No hay mensajes aún</Text>
              <Text style={styles.emptySubtext}>
                Inicia la conversación escribiendo un mensaje
              </Text>
            </View>
          }
        />

        {/* Input de mensaje */}
        <View style={styles.inputContainer}>
          <View style={styles.inputWrapper}>
            <TextInput
              style={styles.messageInput}
              placeholder="Escribe un mensaje..."
              placeholderTextColor="#999"
              value={newMessage}
              onChangeText={setNewMessage}
              multiline
              maxLength={500}
              editable={!isSending}
            />
            <Text style={styles.charCount}>
              {newMessage.length}/500
            </Text>
          </View>

          <TouchableOpacity
            style={[ 
              styles.sendButton,
              (!newMessage.trim() || isSending) && styles.sendButtonDisabled,
            ]}
            onPress={handleSendMessage}
            disabled={!newMessage.trim() || isSending}
          >
            {isSending ? (
              <ActivityIndicator size="small" color="#fff" />
            ) : (
              <Ionicons name="send" size={20} color="#fff" />
            )}
          </TouchableOpacity>
        </View>
      </View>
    </KeyboardAvoidingView>
  );
}
