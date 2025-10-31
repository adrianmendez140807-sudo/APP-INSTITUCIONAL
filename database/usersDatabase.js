// database/usersDatabase.js
import * as SQLite from 'expo-sqlite';
import * as Crypto from 'expo-crypto';

const userDb = SQLite.openDatabaseSync("users.db");

// --- FUNCIÓN PARA INICIALIZAR LA BASE DE DATOS DE USUARIOS ---
const initUsersDatabase = async () => {
  try {
    await userDb.execAsync(`
      PRAGMA journal_mode = WAL;
      CREATE TABLE IF NOT EXISTS users (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        name TEXT,
        email TEXT UNIQUE,
        password TEXT,
        role TEXT,
        documentNumber TEXT UNIQUE,
        telefono TEXT,
        direccion TEXT,
        fechaNacimiento TEXT,
        -- Campos de Docente
        fechaIngreso TEXT,
        tituloAcademico TEXT,
        materias TEXT,
        grados TEXT,
        directorDeGrupo TEXT,
        -- Campos de Estudiante
        nombreAcudiente TEXT,
        telefonoAcudiente TEXT,
        emailAcudiente TEXT,
        grado TEXT,
        jornada TEXT,
        estado TEXT
      );
      CREATE TABLE IF NOT EXISTS notas (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        student_id INTEGER NOT NULL,
        materia TEXT NOT NULL,
        periodo INTEGER NOT NULL,
        nota REAL,
        descripcion TEXT,
        FOREIGN KEY(student_id) REFERENCES users(id) ON DELETE CASCADE
      );
      CREATE TABLE IF NOT EXISTS asistencias (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        student_id INTEGER NOT NULL,
        fecha TEXT NOT NULL,
        status TEXT NOT NULL,
        UNIQUE(student_id, fecha),
        FOREIGN KEY(student_id) REFERENCES users(id) ON DELETE CASCADE
      );
      CREATE TABLE IF NOT EXISTS horarios (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        grado TEXT UNIQUE NOT NULL,
        horario_data TEXT NOT NULL
      );
      CREATE TABLE IF NOT EXISTS materia_colores (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        materia TEXT UNIQUE NOT NULL,
        color TEXT NOT NULL
      );
      CREATE TABLE IF NOT EXISTS notas_personales (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        student_id INTEGER NOT NULL,
        titulo TEXT,
        contenido TEXT,
        fecha_modificacion DATETIME DEFAULT CURRENT_TIMESTAMP,
        FOREIGN KEY(student_id) REFERENCES users(id) ON DELETE CASCADE
      );
      CREATE TABLE IF NOT EXISTS tareas (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        student_id INTEGER NOT NULL,
        titulo TEXT NOT NULL,
        descripcion TEXT,
        fecha_entrega TEXT,
        completada INTEGER DEFAULT 0,
        FOREIGN KEY(student_id) REFERENCES users(id) ON DELETE CASCADE
      );
      CREATE INDEX IF NOT EXISTS idx_users_email ON users(email);
      CREATE INDEX IF NOT EXISTS idx_users_role ON users(role);
      CREATE INDEX IF NOT EXISTS idx_notas_student ON notas(student_id);
      CREATE INDEX IF NOT EXISTS idx_asistencias_student_fecha ON asistencias(student_id, fecha);
      CREATE INDEX IF NOT EXISTS idx_horarios_grado ON horarios(grado);
      CREATE INDEX IF NOT EXISTS idx_materia_colores_materia ON materia_colores(materia);
      CREATE INDEX IF NOT EXISTS idx_notas_personales_student ON notas_personales(student_id);
      CREATE INDEX IF NOT EXISTS idx_tareas_student ON tareas(student_id);
    `);
    console.log("✅ Tablas de la base de datos de usuarios aseguradas.");

    // Ejecutar migraciones para actualizar la estructura si es necesario
    await runUserMigrations();

    await seedMainUsers();
  } catch (error) {
    console.error("❌ Error inicializando base de datos de usuarios:", error);
    throw error;
  }
};

// --- FUNCIÓN PARA EJECUTAR MIGRACIONES DE LA BASE DE DATOS DE USUARIOS ---
const runUserMigrations = async () => {
  try {
    // Migración Definitiva para la tabla 'asistencias'
    const columns = await userDb.getAllAsync('PRAGMA table_info(asistencias)');
    const hasStatusColumn = columns.some(col => col.name === 'status');
    const hasEstadoColumn = columns.some(col => col.name === 'estado');

    // Si la tabla tiene la columna incorrecta 'estado' o no tiene 'status', la recreamos.
    if (hasEstadoColumn || !hasStatusColumn) {
      console.log("🔄 Ejecutando migración robusta para la tabla 'asistencias'...");
      await userDb.execAsync(`
        -- Crear una tabla temporal con la estructura correcta
        CREATE TABLE IF NOT EXISTS asistencias_new (
          id INTEGER PRIMARY KEY AUTOINCREMENT,
          student_id INTEGER NOT NULL,
          fecha TEXT NOT NULL,
          status TEXT NOT NULL,
          UNIQUE(student_id, fecha)
        );
        -- Copiar datos si la tabla antigua existe y tiene la columna 'estado'
        ${hasEstadoColumn ? 'INSERT INTO asistencias_new (id, student_id, fecha, status) SELECT id, student_id, fecha, estado FROM asistencias;' : ''}
        -- Borrar la tabla antigua
        DROP TABLE asistencias;
        -- Renombrar la tabla nueva a la original
        ALTER TABLE asistencias_new RENAME TO asistencias;
      `);
      console.log("✅ Migración completada.");
    }

    // Migración para asegurar que horario_data puede manejar la nueva estructura de tabla.
    // Esto es más una salvaguarda; si el formato JSON cambia, se adaptará.
    // No se necesita un cambio de esquema si solo cambia el contenido del JSON.
    // Sin embargo, si un horario antiguo (string simple por día) se carga,
    // la nueva interfaz lo tratará como un objeto vacío, permitiendo la actualización.
    const horarioTest = await userDb.getFirstAsync("SELECT horario_data FROM horarios LIMIT 1");
    if (horarioTest) {
      try {
        JSON.parse(horarioTest.horario_data);
      } catch (e) {
        console.log("🔄 Formato de horario antiguo detectado. Se permitirá la sobreescritura.");
      }
    }
  } catch (error) {
    console.error("❌ Error durante las migraciones de la base de datos de usuarios:", error);
  }
};

// --- FUNCIÓN PARA CREAR USUARIOS PRINCIPALES (Solo la primera vez) ---
const seedMainUsers = async () => {
  const mainUsers = [
    { name: "Secretaria", email: "secretaria@institucion.com", password: "secretaria123", role: "secretaria", documentNumber: "10000001" },
    { name: "Rector", email: "rector@institucion.com", password: "rector123", role: "rector", documentNumber: "10000002" },
    { name: "Coordinador", email: "coordinador@institucion.com", password: "coordinador123", role: "coordinador", documentNumber: "10000003" }
  ];

  for (const user of mainUsers) {
    const exists = await userDb.getFirstAsync("SELECT id FROM users WHERE email = ?", [user.email]);
    if (!exists) {
      await addUser(user.name, user.email, user.password, user.role, user.documentNumber);
    }
  }
};

// --- FUNCIÓN PARA AÑADIR USUARIOS ---
const addUser = async (userData) => {
  const { name, email, password, role, documentNumber, grado } = userData;
  const hashedPassword = await Crypto.digestStringAsync(
    Crypto.CryptoDigestAlgorithm.SHA256,
    password
  );
  try {
    const result = await userDb.runAsync(
      'INSERT INTO users (name, email, password, role, documentNumber, grado) VALUES (?, ?, ?, ?, ?, ?)',
      [name, email, hashedPassword, role, documentNumber, grado ?? null]
    );
    console.log(`✅ Usuario agregado: ${name} (${role}) con ID: ${result.lastInsertRowId}`);
    return result.lastInsertRowId;
  } catch (error) {
    if (error.message && error.message.includes('UNIQUE constraint failed')) {
      console.warn(`⚠️ Intento de agregar usuario duplicado: ${email}`);
      return null;
    }
    console.error("❌ Error al insertar usuario:", error);
    throw error;
  }
};

// --- FUNCIÓN PARA VERIFICAR LOGIN ---
const getUserByLogin = async (email, password) => {
  const hashedPassword = await Crypto.digestStringAsync(
    Crypto.CryptoDigestAlgorithm.SHA256,
    password
  );
  try {
    const user = await userDb.getFirstAsync(
      "SELECT * FROM users WHERE email = ? AND password = ?",
      [email, hashedPassword]
    );
    return user || null;
  } catch (error) {
    console.error("❌ Error al buscar usuario por login:", error);
    return null;
  }
};

// --- FUNCIÓN PARA OBTENER TODOS LOS USUARIOS ---
const getUsers = async () => {
  try {
    const users = await userDb.getAllAsync("SELECT * FROM users");
    return users;
  } catch (error) {
    console.error("❌ Error al obtener usuarios:", error);
    return [];
  }
};

// --- FUNCIÓN PARA OBTENER UN USUARIO POR ID ---
const getUserById = async (id) => {
  try {
    const user = await userDb.getFirstAsync("SELECT * FROM users WHERE id = ?", [id]);
    return user || null;
  } catch (error) {
    console.error("❌ Error al obtener usuario por ID:", error);
    return null;
  }
};

// --- FUNCIÓN PARA ELIMINAR UN USUARIO ---
const deleteUser = async (id) => {
  try {
    await userDb.runAsync("DELETE FROM users WHERE id = ?", [id]);
    console.log(`🗑️ Usuario eliminado con ID: ${id}`);
    return true;
  } catch (error) {
    console.error("❌ Error al eliminar usuario:", error);
    throw error;
  }
};

// --- FUNCIÓN PARA ACTUALIZAR USUARIO ---
const updateUser = async (user) => {
  try {
    await userDb.runAsync(
      `UPDATE users SET 
        name = ?, email = ?, documentNumber = ?, telefono = ?, 
        direccion = ?, fechaNacimiento = ?, 
        fechaIngreso = ?, tituloAcademico = ?, materias = ?, 
        grados = ?, directorDeGrupo = ?,
        nombreAcudiente = ?, telefonoAcudiente = ?, emailAcudiente = ?,
        grado = ?, jornada = ?, estado = ?
       WHERE id = ?;`,
      [
        user.name ?? null,
        user.email ?? null,
        user.documentNumber ?? null,
        user.telefono ?? null,
        user.direccion ?? null,
        user.fechaNacimiento ?? null,
        user.fechaIngreso ?? null,
        user.tituloAcademico ?? null,
        user.materias ?? null,
        user.grados ?? null,
        user.directorDeGrupo ?? null,
        user.nombreAcudiente ?? null,
        user.telefonoAcudiente ?? null,
        user.emailAcudiente ?? null,
        user.grado ?? null,
        user.jornada ?? null,
        user.estado ?? null,
        user.id
      ]
    );
    console.log(`✏️ Usuario actualizado con ID: ${user.id}`);
    return true;
  } catch (error) {
    console.error("❌ Error al actualizar usuario:", error);
    throw error;
  }
};

// --- FUNCIÓN PARA ACTUALIZAR LA CONTRASEÑA DE UN USUARIO ---
const updateUserPassword = async (userId, newPassword) => {
  const hashedPassword = await Crypto.digestStringAsync(
    Crypto.CryptoDigestAlgorithm.SHA256,
    newPassword
  );
  try {
    await userDb.runAsync(
      'UPDATE users SET password = ? WHERE id = ?',
      [hashedPassword, userId]
    );
    console.log(`🔑 Contraseña actualizada para el usuario ID: ${userId}`);
    return true;
  } catch (error) {
    console.error("❌ Error al actualizar la contraseña:", error);
    throw error;
  }
};

// --- FUNCIÓN PARA OBTENER NOTAS POR ESTUDIANTE ---
const getNotesByStudent = async (studentId) => {
  try {
    const notes = await userDb.getAllAsync(
      "SELECT * FROM notas WHERE student_id = ? ORDER BY periodo, materia",
      [studentId]
    );
    return notes;
  } catch (error) {
    console.error("❌ Error al obtener las notas del estudiante:", error);
    return [];
  }
};

// --- FUNCIÓN PARA AÑADIR O ACTUALIZAR UNA NOTA ---
const addOrUpdateNote = async (note) => {
  const { id, student_id, materia, periodo, nota, descripcion } = note;
  try {
    if (id) {
      await userDb.runAsync(
        'UPDATE notas SET student_id = ?, materia = ?, periodo = ?, nota = ?, descripcion = ? WHERE id = ?',
        [student_id, materia, periodo, nota, descripcion, id]
      );
      console.log(`✏️ Nota actualizada con ID: ${id}`);
      return id;
    } else {
      const result = await userDb.runAsync(
        'INSERT INTO notas (student_id, materia, periodo, nota, descripcion) VALUES (?, ?, ?, ?, ?)',
        [student_id, materia, periodo, nota, descripcion]
      );
      console.log(`✅ Nueva nota agregada con ID: ${result.lastInsertRowId}`);
      return result.lastInsertRowId;
    }
  } catch (error) {
    console.error("❌ Error al guardar la nota:", error);
    throw error;
  }
};

// --- FUNCIÓN PARA OBTENER REPORTE DE ASISTENCIA ---
const getAttendanceReport = async (studentId, startDate, endDate) => {
  try {
    const records = await userDb.getAllAsync(
      "SELECT * FROM asistencias WHERE student_id = ? AND fecha BETWEEN ? AND ? ORDER BY fecha ASC",
      [studentId, startDate, endDate]
    );
    return records;
  } catch (error) {
    console.error("❌ Error al obtener reporte de asistencia:", error);
    return [];
  }
};

// --- FUNCIÓN PARA AÑADIR O ACTUALIZAR ASISTENCIA ---
const addOrUpdateAttendance = async (attendanceRecord) => {
  const { student_id, fecha, status } = attendanceRecord;
  try {
    // Verificar si ya existe un registro para ese estudiante y fecha
    const existingRecord = await userDb.getFirstAsync(
      "SELECT id FROM asistencias WHERE student_id = ? AND fecha = ?",
      [student_id, fecha]
    );

    if (existingRecord) {
      // Si existe, actualizarlo
      await userDb.runAsync(
        'UPDATE asistencias SET status = ? WHERE id = ?',
        [status, existingRecord.id]
      );
      console.log(`✏️ Asistencia actualizada para fecha: ${fecha}`);
      return existingRecord.id;
    } else {
      // Si no existe, insertarlo
      const result = await userDb.runAsync(
        'INSERT INTO asistencias (student_id, fecha, status) VALUES (?, ?, ?)',
        [student_id, fecha, status]
      );
      console.log(`✅ Nueva asistencia agregada para fecha: ${fecha}`);
      return result.lastInsertRowId;
    }
  } catch (error) {
    console.error("❌ Error al guardar la asistencia:", error);
    throw error;
  }
};

// --- FUNCIÓN PARA OBTENER HORARIO POR GRADO ---
const getHorarioByGrado = async (grado) => {
  try {
    const record = await userDb.getFirstAsync(
      "SELECT horario_data FROM horarios WHERE grado = ?",
      [grado]
    );
    return record ? JSON.parse(record.horario_data) : null;
  } catch (error) {
    console.error("❌ Error al obtener horario por grado:", error);
    return null;
  }
};

// --- FUNCIÓN PARA AÑADIR O ACTUALIZAR HORARIO ---
const addOrUpdateHorario = async (grado, horarioData) => {
  const horarioJson = JSON.stringify(horarioData);
  try {
    const existing = await userDb.getFirstAsync(
      "SELECT id FROM horarios WHERE grado = ?",
      [grado]
    );

    if (existing) {
      await userDb.runAsync(
        'UPDATE horarios SET horario_data = ? WHERE grado = ?',
        [horarioJson, grado]
      );
      console.log(`✏️ Horario actualizado para el grado: ${grado}`);
    } else {
      await userDb.runAsync(
        'INSERT INTO horarios (grado, horario_data) VALUES (?, ?)',
        [grado, horarioJson]
      );
      console.log(`✅ Nuevo horario creado para el grado: ${grado}`);
    }
    return true;
  } catch (error) {
    console.error("❌ Error al guardar el horario:", error);
    throw error;
  }
};

// --- FUNCIÓN PARA OBTENER COLORES DE MATERIAS ---
const getMateriaColores = async () => {
  try {
    const records = await userDb.getAllAsync("SELECT * FROM materia_colores");
    // Convertir el array de resultados en un objeto para fácil acceso: {materia: color}
    const colorMap = records.reduce((acc, item) => {
      acc[item.materia.toLowerCase()] = item.color;
      return acc;
    }, {});
    return colorMap;
  } catch (error) {
    console.error("❌ Error al obtener los colores de las materias:", error);
    return {};
  }
};

// --- FUNCIÓN PARA AÑADIR O ACTUALIZAR COLOR DE MATERIA ---
const addOrUpdateMateriaColor = async (materia, color) => {
  try {
    const existing = await userDb.getFirstAsync(
      "SELECT id FROM materia_colores WHERE materia = ?",
      [materia]
    );

    if (existing) {
      await userDb.runAsync(
        'UPDATE materia_colores SET color = ? WHERE materia = ?',
        [color, materia]
      );
      console.log(`✏️ Color actualizado para la materia: ${materia}`);
    } else {
      await userDb.runAsync(
        'INSERT INTO materia_colores (materia, color) VALUES (?, ?)',
        [materia, color]
      );
      console.log(`✅ Nuevo color asignado para la materia: ${materia}`);
    }
    return true;
  } catch (error) {
    console.error("❌ Error al guardar el color de la materia:", error);
    throw error;
  }
};

// --- FUNCIONES PARA NOTAS PERSONALES ---
const getPersonalNotes = async (studentId) => {
  try {
    return await userDb.getAllAsync(
      "SELECT * FROM notas_personales WHERE student_id = ? ORDER BY fecha_modificacion DESC",
      [studentId]
    );
  } catch (error) {
    console.error("❌ Error al obtener notas personales:", error);
    return [];
  }
};

const addOrUpdatePersonalNote = async (note) => {
  const { id, student_id, titulo, contenido } = note;
  try {
    if (id) {
      await userDb.runAsync(
        'UPDATE notas_personales SET titulo = ?, contenido = ?, fecha_modificacion = CURRENT_TIMESTAMP WHERE id = ?',
        [titulo, contenido, id]
      );
      return id;
    } else {
      const result = await userDb.runAsync(
        'INSERT INTO notas_personales (student_id, titulo, contenido) VALUES (?, ?, ?)',
        [student_id, titulo, contenido]
      );
      return result.lastInsertRowId;
    }
  } catch (error) {
    console.error("❌ Error al guardar nota personal:", error);
    throw error;
  }
};

const deletePersonalNote = async (noteId) => {
  try {
    await userDb.runAsync("DELETE FROM notas_personales WHERE id = ?", [noteId]);
    return true;
  } catch (error) {
    console.error("❌ Error al eliminar nota personal:", error);
    throw error;
  }
};

// --- FUNCIONES PARA TAREAS ---
const getTasks = async (studentId) => {
  try {
    return await userDb.getAllAsync(
      "SELECT * FROM tareas WHERE student_id = ? ORDER BY completada ASC, fecha_entrega ASC",
      [studentId]
    );
  } catch (error) {
    console.error("❌ Error al obtener tareas:", error);
    return [];
  }
};

const addOrUpdateTask = async (task) => {
  const { id, student_id, titulo, descripcion, fecha_entrega } = task;
  try {
    if (id) {
      await userDb.runAsync(
        'UPDATE tareas SET titulo = ?, descripcion = ?, fecha_entrega = ? WHERE id = ?',
        [titulo, descripcion, fecha_entrega, id]
      );
      return id;
    } else {
      const result = await userDb.runAsync(
        'INSERT INTO tareas (student_id, titulo, descripcion, fecha_entrega) VALUES (?, ?, ?, ?)',
        [student_id, titulo, descripcion, fecha_entrega]
      );
      return result.lastInsertRowId;
    }
  } catch (error) {
    console.error("❌ Error al guardar tarea:", error);
    throw error;
  }
};

const deleteTask = async (taskId) => {
  try {
    await userDb.runAsync("DELETE FROM tareas WHERE id = ?", [taskId]);
    return true;
  } catch (error) {
    console.error("❌ Error al eliminar tarea:", error);
    throw error;
  }
};

const toggleTaskCompleted = async (taskId, completed) => {
  try {
    await userDb.runAsync(
      'UPDATE tareas SET completada = ? WHERE id = ?',
      [completed ? 1 : 0, taskId]
    );
    return true;
  } catch (error) {
    console.error("❌ Error al actualizar estado de tarea:", error);
    throw error;
  }
};

// --- EXPORTACIÓN DEL SERVICIO DE USUARIOS ---
const usersDbService = {
  initUsersDatabase,
  addUser,
  getUserByLogin,
  getUsers,
  getUserById,
  deleteUser,
  updateUser,
  getNotesByStudent,
  updateUserPassword,
  addOrUpdateNote,
  getAttendanceReport,
  addOrUpdateAttendance,
  getHorarioByGrado,
  addOrUpdateHorario,
  getMateriaColores,
  addOrUpdateMateriaColor,
  getPersonalNotes,
  addOrUpdatePersonalNote,
  deletePersonalNote,
  getTasks,
  addOrUpdateTask,
  deleteTask,
  toggleTaskCompleted,
};

module.exports = usersDbService;