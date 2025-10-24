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
      CREATE INDEX IF NOT EXISTS idx_users_email ON users(email);
      CREATE INDEX IF NOT EXISTS idx_users_role ON users(role);
      CREATE INDEX IF NOT EXISTS idx_notas_student ON notas(student_id);
    `);
    console.log("✅ Base de datos de usuarios creada correctamente");
    await seedMainUsers();
  } catch (error) {
    console.error("❌ Error inicializando base de datos de usuarios:", error);
    throw error;
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
const addUser = async (name, email, password, role, documentNumber) => {
  const hashedPassword = await Crypto.digestStringAsync(
    Crypto.CryptoDigestAlgorithm.SHA256,
    password
  );
  try {
    const result = await userDb.runAsync(
      'INSERT INTO users (name, email, password, role, documentNumber) VALUES (?, ?, ?, ?, ?)',
      [name, email, hashedPassword, role, documentNumber]
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
  addOrUpdateNote,
};

module.exports = usersDbService;