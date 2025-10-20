// database/index.js
import usersDbService from './usersDatabase';
import messagingDbService from './messagingDatabase';

// --- INICIALIZAR AMBAS BASES DE DATOS ---
export const initializeDatabases = async () => {
  try {
    console.log('🔄 Inicializando bases de datos...');
    await usersDbService.initUsersDatabase();
    await messagingDbService.initMessagingDatabase();
    console.log('✅ Ambas bases de datos inicializadas correctamente');
    return true;
  } catch (error) {
    console.error('❌ Error inicializando bases de datos:', error);
    throw error;
  }
};

// --- COMBINAR Y EXPORTAR TODOS LOS SERVICIOS ---
const dbService = {
  // Servicios de Usuarios
  initUsersDatabase: usersDbService.initUsersDatabase,
  addUser: usersDbService.addUser,
  getUserByLogin: usersDbService.getUserByLogin,
  getUsers: usersDbService.getUsers,
  getUserById: usersDbService.getUserById,
  deleteUser: usersDbService.deleteUser,
  updateUser: usersDbService.updateUser,
  getNotesByStudent: usersDbService.getNotesByStudent,
  addOrUpdateNote: usersDbService.addOrUpdateNote,

  // Servicios de Mensajería
  initMessagingDatabase: messagingDbService.initMessagingDatabase,
  sendDirectMessage: messagingDbService.sendDirectMessage,
  createGroupConversation: messagingDbService.createGroupConversation,
  getConversationsForUser: messagingDbService.getConversationsForUser,
  getMessagesFromConversation: messagingDbService.getMessagesFromConversation,
  markMessagesAsRead: messagingDbService.markMessagesAsRead,
  getUnreadMessageCount: messagingDbService.getUnreadMessageCount,
  sendGroupMessage: messagingDbService.sendGroupMessage,
  deleteMessage: messagingDbService.deleteMessage,
  addMemberToGroup: messagingDbService.addMemberToGroup,
  getConversationDetails: messagingDbService.getConversationDetails,
  getConversationMembers: messagingDbService.getConversationMembers,
  deleteConversation: messagingDbService.deleteConversation,
};

export default dbService;