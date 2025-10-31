const usersDbService = require('./usersDatabase');
const messagingDbService = require('./messagingDatabase');

// --- COMBINAR Y EXPORTAR TODOS LOS SERVICIOS ---
const dbService = {
  // Inicialización
  initializeDatabases: async () => {
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
  },

  // Servicios de Usuarios
  initUsersDatabase: usersDbService.initUsersDatabase,
  addUser: usersDbService.addUser,
  getUserByLogin: usersDbService.getUserByLogin,
  getUsers: usersDbService.getUsers,
  getUserById: usersDbService.getUserById,
  deleteUser: usersDbService.deleteUser,
  updateUser: usersDbService.updateUser,
  getNotesByStudent: usersDbService.getNotesByStudent,
  updateUserPassword: usersDbService.updateUserPassword,
  addOrUpdateNote: usersDbService.addOrUpdateNote,
  getAttendanceReport: usersDbService.getAttendanceReport,
  addOrUpdateAttendance: usersDbService.addOrUpdateAttendance,
  getHorarioByGrado: usersDbService.getHorarioByGrado,
  addOrUpdateHorario: usersDbService.addOrUpdateHorario,
  getMateriaColores: usersDbService.getMateriaColores,
  addOrUpdateMateriaColor: usersDbService.addOrUpdateMateriaColor,
  getPersonalNotes: usersDbService.getPersonalNotes,
  addOrUpdatePersonalNote: usersDbService.addOrUpdatePersonalNote,
  deletePersonalNote: usersDbService.deletePersonalNote,
  getTasks: usersDbService.getTasks,
  addOrUpdateTask: usersDbService.addOrUpdateTask,
  deleteTask: usersDbService.deleteTask,
  toggleTaskCompleted: usersDbService.toggleTaskCompleted,

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
  getConversationById: messagingDbService.getConversationById,
};

module.exports = dbService;