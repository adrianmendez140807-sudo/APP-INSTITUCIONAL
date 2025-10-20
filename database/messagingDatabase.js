// database/messagingDatabase.js
import * as SQLite from 'expo-sqlite';

const msgDb = SQLite.openDatabaseSync("messaging.db");

// --- FUNCIÓN PARA INICIALIZAR LA BASE DE DATOS DE MENSAJERÍA ---
const initMessagingDatabase = async () => {
  try {
    await msgDb.execAsync(`
      PRAGMA journal_mode = WAL;
      CREATE TABLE IF NOT EXISTS mensajes (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        sender_id INTEGER NOT NULL,
        recipient_id INTEGER,
        conversation_id TEXT NOT NULL,
        content TEXT NOT NULL,
        tipo_mensaje TEXT NOT NULL,
        fecha DATETIME DEFAULT CURRENT_TIMESTAMP,
        leido INTEGER DEFAULT 0
      );

      CREATE TABLE IF NOT EXISTS conversaciones (
        id TEXT PRIMARY KEY,
        titulo TEXT NOT NULL,
        tipo TEXT NOT NULL,
        creador_id INTEGER NOT NULL,
        fecha_creacion DATETIME DEFAULT CURRENT_TIMESTAMP,
        ultima_actividad DATETIME DEFAULT CURRENT_TIMESTAMP
      );

      CREATE TABLE IF NOT EXISTS miembros_conversacion (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        conversation_id TEXT NOT NULL,
        user_id INTEGER NOT NULL,
        UNIQUE(conversation_id, user_id)
      );

      CREATE INDEX IF NOT EXISTS idx_mensajes_sender ON mensajes(sender_id);
      CREATE INDEX IF NOT EXISTS idx_mensajes_recipient ON mensajes(recipient_id);
      CREATE INDEX IF NOT EXISTS idx_mensajes_conversation ON mensajes(conversation_id);
      CREATE INDEX IF NOT EXISTS idx_mensajes_fecha ON mensajes(fecha);
      CREATE INDEX IF NOT EXISTS idx_mensajes_leido ON mensajes(leido);
      CREATE INDEX IF NOT EXISTS idx_conversaciones_creador ON conversaciones(creador_id);
      CREATE INDEX IF NOT EXISTS idx_miembros_conversation ON miembros_conversacion(conversation_id);
      CREATE INDEX IF NOT EXISTS idx_miembros_user ON miembros_conversacion(user_id);
    `);
    console.log("✅ Base de datos de mensajería creada correctamente");
  } catch (error) {
    console.error("❌ Error inicializando base de datos de mensajería:", error);
    throw error;
  }
};

// --- FUNCIÓN PARA ENVIAR MENSAJE DIRECTO ---
const sendDirectMessage = async (senderId, recipientId, content) => {
  try {
    const conversationId = [senderId, recipientId].sort().join('_');
    
    // Verificar si la conversación existe
    const convExists = await msgDb.getFirstAsync(
      "SELECT id FROM conversaciones WHERE id = ?",
      [conversationId]
    );

    if (!convExists) {
      await msgDb.runAsync(
        `INSERT INTO conversaciones (id, titulo, tipo, creador_id) 
         VALUES (?, ?, ?, ?)`,
        [conversationId, `Conversación privada`, 'privada', senderId]
      );

      // Agregar miembros
      await msgDb.runAsync(
        "INSERT INTO miembros_conversacion (conversation_id, user_id) VALUES (?, ?)",
        [conversationId, senderId]
      );
      await msgDb.runAsync(
        "INSERT INTO miembros_conversacion (conversation_id, user_id) VALUES (?, ?)",
        [conversationId, recipientId]
      );
    }

    // Insertar mensaje
    const result = await msgDb.runAsync(
      `INSERT INTO mensajes (sender_id, recipient_id, conversation_id, content, tipo_mensaje) 
       VALUES (?, ?, ?, ?, ?)`,
      [senderId, recipientId, conversationId, content, 'directo']
    );

    // Actualizar última actividad
    await msgDb.runAsync(
      "UPDATE conversaciones SET ultima_actividad = CURRENT_TIMESTAMP WHERE id = ?",
      [conversationId]
    );

    console.log(`✅ Mensaje directo enviado con ID: ${result.lastInsertRowId}`);
    return result.lastInsertRowId;
  } catch (error) {
    console.error("❌ Error al enviar mensaje directo:", error);
    throw error;
  }
};

// --- FUNCIÓN PARA CREAR GRUPO DE MENSAJERÍA ---
const createGroupConversation = async (title, creatorId, memberIds) => {
  try {
    const conversationId = `grupo_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;

    await msgDb.runAsync(
      `INSERT INTO conversaciones (id, titulo, tipo, creador_id) 
       VALUES (?, ?, ?, ?)`,
      [conversationId, title, 'grupo', creatorId]
    );

    // Agregar creador como miembro
    await msgDb.runAsync(
      "INSERT INTO miembros_conversacion (conversation_id, user_id) VALUES (?, ?)",
      [conversationId, creatorId]
    );

    // Agregar otros miembros
    for (const memberId of memberIds) {
      await msgDb.runAsync(
        "INSERT INTO miembros_conversacion (conversation_id, user_id) VALUES (?, ?)",
        [conversationId, memberId]
      );
    }

    console.log(`✅ Grupo de conversación creado con ID: ${conversationId}`);
    return conversationId;
  } catch (error) {
    console.error("❌ Error al crear grupo:", error);
    throw error;
  }
};

// --- FUNCIÓN PARA OBTENER CONVERSACIONES DE UN USUARIO ---
const getConversationsForUser = async (userId) => {
  try {
    const conversations = await msgDb.getAllAsync(
      `SELECT DISTINCT c.* FROM conversaciones c
       INNER JOIN miembros_conversacion m ON c.id = m.conversation_id
       WHERE m.user_id = ?
       ORDER BY c.ultima_actividad DESC`,
      [userId]
    );
    return conversations;
  } catch (error) {
    console.error("❌ Error al obtener conversaciones:", error);
    return [];
  }
};

// --- FUNCIÓN PARA OBTENER MENSAJES DE UNA CONVERSACIÓN ---
const getMessagesFromConversation = async (conversationId, limit = 50) => {
  try {
    const messages = await msgDb.getAllAsync(
      `SELECT m.* FROM mensajes m
       WHERE m.conversation_id = ?
       ORDER BY m.fecha ASC
       LIMIT ?`,
      [conversationId, limit]
    );
    return messages;
  } catch (error) {
    console.error("❌ Error al obtener mensajes:", error);
    return [];
  }
};

// --- FUNCIÓN PARA MARCAR MENSAJES COMO LEÍDOS ---
const markMessagesAsRead = async (conversationId, userId) => {
  try {
    await msgDb.runAsync(
      `UPDATE mensajes SET leido = 1 
       WHERE conversation_id = ? AND recipient_id = ? AND leido = 0`,
      [conversationId, userId]
    );
    console.log(`✅ Mensajes marcados como leídos`);
    return true;
  } catch (error) {
    console.error("❌ Error al marcar mensajes:", error);
    throw error;
  }
};

// --- FUNCIÓN PARA OBTENER CONTEO DE MENSAJES NO LEÍDOS ---
const getUnreadMessageCount = async (userId) => {
  try {
    const result = await msgDb.getFirstAsync(
      `SELECT COUNT(*) as unread_count FROM mensajes 
       WHERE recipient_id = ? AND leido = 0`,
      [userId]
    );
    return result?.unread_count || 0;
  } catch (error) {
    console.error("❌ Error al obtener conteo de no leídos:", error);
    return 0;
  }
};

// --- FUNCIÓN PARA ENVIAR MENSAJE DE GRUPO ---
const sendGroupMessage = async (senderId, conversationId, content) => {
  try {
    const result = await msgDb.runAsync(
      `INSERT INTO mensajes (sender_id, conversation_id, content, tipo_mensaje) 
       VALUES (?, ?, ?, ?)`,
      [senderId, conversationId, content, 'grupo']
    );

    // Actualizar última actividad
    await msgDb.runAsync(
      "UPDATE conversaciones SET ultima_actividad = CURRENT_TIMESTAMP WHERE id = ?",
      [conversationId]
    );

    console.log(`✅ Mensaje de grupo enviado con ID: ${result.lastInsertRowId}`);
    return result.lastInsertRowId;
  } catch (error) {
    console.error("❌ Error al enviar mensaje de grupo:", error);
    throw error;
  }
};

// --- FUNCIÓN PARA ELIMINAR MENSAJE ---
const deleteMessage = async (messageId) => {
  try {
    await msgDb.runAsync("DELETE FROM mensajes WHERE id = ?", [messageId]);
    console.log(`🗑️ Mensaje eliminado con ID: ${messageId}`);
    return true;
  } catch (error) {
    console.error("❌ Error al eliminar mensaje:", error);
    throw error;
  }
};

// --- FUNCIÓN PARA AGREGAR MIEMBRO A GRUPO ---
const addMemberToGroup = async (conversationId, userId) => {
  try {
    await msgDb.runAsync(
      "INSERT INTO miembros_conversacion (conversation_id, user_id) VALUES (?, ?)",
      [conversationId, userId]
    );
    console.log(`✅ Miembro agregado al grupo`);
    return true;
  } catch (error) {
    if (error.message && error.message.includes('UNIQUE constraint failed')) {
      console.warn("⚠️ El usuario ya es miembro del grupo");
      return false;
    }
    console.error("❌ Error al agregar miembro:", error);
    throw error;
  }
};

// --- FUNCIÓN PARA OBTENER DETALLES DE CONVERSACIÓN ---
const getConversationDetails = async (conversationId) => {
  try {
    const conversation = await msgDb.getFirstAsync(
      "SELECT * FROM conversaciones WHERE id = ?",
      [conversationId]
    );
    return conversation || null;
  } catch (error) {
    console.error("❌ Error al obtener detalles de conversación:", error);
    return null;
  }
};

// --- FUNCIÓN PARA OBTENER MIEMBROS DE CONVERSACIÓN ---
const getConversationMembers = async (conversationId) => {
  try {
    const members = await msgDb.getAllAsync(
      "SELECT user_id FROM miembros_conversacion WHERE conversation_id = ?",
      [conversationId]
    );
    return members;
  } catch (error) {
    console.error("❌ Error al obtener miembros:", error);
    return [];
  }
};

// --- FUNCIÓN PARA ELIMINAR CONVERSACIÓN ---
const deleteConversation = async (conversationId) => {
  try {
    // Eliminar miembros
    await msgDb.runAsync(
      "DELETE FROM miembros_conversacion WHERE conversation_id = ?",
      [conversationId]
    );
    // Eliminar mensajes
    await msgDb.runAsync(
      "DELETE FROM mensajes WHERE conversation_id = ?",
      [conversationId]
    );
    // Eliminar conversación
    await msgDb.runAsync(
      "DELETE FROM conversaciones WHERE id = ?",
      [conversationId]
    );
    console.log(`🗑️ Conversación eliminada con ID: ${conversationId}`);
    return true;
  } catch (error) {
    console.error("❌ Error al eliminar conversación:", error);
    throw error;
  }
};

// --- EXPORTACIÓN DEL SERVICIO DE MENSAJERÍA ---
const messagingDbService = {
  initMessagingDatabase,
  sendDirectMessage,
  createGroupConversation,
  getConversationsForUser,
  getMessagesFromConversation,
  markMessagesAsRead,
  getUnreadMessageCount,
  sendGroupMessage,
  deleteMessage,
  addMemberToGroup,
  getConversationDetails,
  getConversationMembers,
  deleteConversation,
};

module.exports = messagingDbService;
export default messagingDbService;