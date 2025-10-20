// components/MessageBubble.js
import React, { useState } from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

const MessageBubble = ({ message, isOwn, currentUserId, onDelete }) => {
  const [showDelete, setShowDelete] = useState(false);

  const formatTime = (dateString) => {
    try {
      const date = new Date(dateString);
      return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    } catch (e) {
      return '00:00';
    }
  };

  return (
    <View style={[styles.messageBubbleContainer, isOwn && styles.ownMessage]}>
      <TouchableOpacity
        style={[styles.messageBubble, isOwn && styles.ownBubble]}
        onLongPress={() => {
          if (isOwn) {
            setShowDelete(!showDelete);
          }
        }}
        delayLongPress={500}
      >
        <Text style={[styles.messageText, isOwn && styles.ownText]}>
          {message.content}
        </Text>
        <View style={styles.messageMetadata}>
          <Text style={[styles.messageTime, isOwn && styles.ownTime]}>
            {formatTime(message.fecha)}
          </Text>
          {message.leido === 1 && isOwn && (
            <Ionicons
              name="checkmark-done"
              size={12}
              color={isOwn ? '#fff' : '#007bff'}
              style={styles.readIcon}
            />
          )}
        </View>
      </TouchableOpacity>

      {showDelete && isOwn && (
        <TouchableOpacity
          style={styles.deleteButton}
          onPress={() => {
            setShowDelete(false);
            onDelete();
          }}
        >
          <Ionicons name="trash-outline" size={16} color="#ff6b6b" />
        </TouchableOpacity>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  messageBubbleContainer: {
    flexDirection: 'row',
    paddingHorizontal: 12,
    paddingVertical: 8,
    justifyContent: 'flex-start',
    alignItems: 'flex-end',
  },
  ownMessage: {
    justifyContent: 'flex-end',
  },
  messageBubble: {
    backgroundColor: '#e9ecef',
    borderRadius: 18,
    paddingHorizontal: 14,
    paddingVertical: 10,
    maxWidth: '80%',
  },
  ownBubble: {
    backgroundColor: '#007bff',
  },
  messageText: {
    color: '#212529',
    fontSize: 15,
    lineHeight: 20,
  },
  ownText: {
    color: '#fff',
  },
  messageMetadata: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 4,
    gap: 4,
    justifyContent: 'flex-end',
  },
  messageTime: {
    fontSize: 12,
    color: '#6c757d',
  },
  ownTime: {
    color: 'rgba(255, 255, 255, 0.8)',
  },
  readIcon: {
    marginLeft: 2,
  },
  deleteButton: {
    marginLeft: 8,
    padding: 8,
    backgroundColor: '#fff',
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#ff6b6b',
  },
});

export default MessageBubble;
