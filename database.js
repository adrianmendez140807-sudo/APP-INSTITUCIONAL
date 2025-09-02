import * as SQLite from 'expo-sqlite';
import * as Crypto from 'expo-crypto';

// Usamos la nueva API síncrona de expo-sqlite para simplificar
const db = SQLite.openDatabaseSync("app.db");

// --- FUNCIÓN PARA INICIALIZAR LA BASE DE DATOS ---
const initDatabase = async () => {
  try {
    // Se eliminó la lógica de ALTER TABLE. Ahora se crea la tabla completa desde el inicio.
    // Esto es más robusto y evita errores de migración en el desarrollo.
    await db.execAsync(`
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
    `);
    console.log("✅ Tabla 'users' creada o ya existente con el esquema completo.");
    
    // Llama a la función para sembrar los usuarios principales si no existen.
    await seedMainUsers();
  } catch (error) {
    console.error("❌ Error fatal inicializando la base de datos:", error);
    throw error;
  }
};

// --- FUNCIÓN PARA AÑADIR USUARIOS (Docentes, Estudiantes, etc.) ---
const addUser = async (name, email, password, role, documentNumber) => {
  const hashedPassword = await Crypto.digestStringAsync(
    Crypto.CryptoDigestAlgorithm.SHA256,
    password
  );
  try {
    const result = await db.runAsync(
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

// --- FUNCIÓN PARA CREAR USUARIOS PRINCIPALES (Solo la primera vez) ---
const seedMainUsers = async () => {
  const mainUsers = [
    { name: "Secretaria", email: "secretaria@institucion.com", password: "secretaria123", role: "secretaria", documentNumber: "10000001" },
    { name: "Rector", email: "rector@institucion.com", password: "rector123", role: "rector", documentNumber: "10000002" },
    { name: "Coordinador", email: "coordinador@institucion.com", password: "coordinador123", role: "coordinador", documentNumber: "10000003" }
  ];

  for (const user of mainUsers) {
    const exists = await db.getFirstAsync("SELECT id FROM users WHERE email = ?", [user.email]);
    if (!exists) {
      await addUser(user.name, user.email, user.password, user.role, user.documentNumber);
    }
  }
};

// --- FUNCIÓN PARA VERIFICAR LOGIN ---
const getUserByLogin = async (email, password) => {
  const hashedPassword = await Crypto.digestStringAsync(
    Crypto.CryptoDigestAlgorithm.SHA256,
    password
  );
  try {
    const user = await db.getFirstAsync(
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
    const users = await db.getAllAsync("SELECT * FROM users");
    return users;
  } catch (error) {
    console.error("❌ Error al obtener usuarios:", error);
    return [];
  }
};

// --- FUNCIÓN PARA ELIMINAR UN USUARIO ---
const deleteUser = async (id) => {
  try {
    await db.runAsync("DELETE FROM users WHERE id = ?", [id]);
    console.log(`🗑️ Usuario eliminado con ID: ${id}`);
    return true;
  } catch (error) {
    console.error("❌ Error al eliminar usuario:", error);
    throw error;
  }
};

// --- FUNCIÓN PARA ACTUALIZAR USUARIO (CORREGIDA) ---
// Acepta un solo objeto 'user' y maneja campos opcionales.
const updateUser = async (user) => {
  try {
    await db.runAsync(
      `UPDATE users SET 
        name = ?, email = ?, documentNumber = ?, telefono = ?, 
        direccion = ?, fechaNacimiento = ?, 
        fechaIngreso = ?, tituloAcademico = ?, materias = ?, 
        grados = ?, directorDeGrupo = ?,
        nombreAcudiente = ?, telefonoAcudiente = ?, emailAcudiente = ?,
        grado = ?, jornada = ?, estado = ?
       WHERE id = ?;`,
      [
        // El operador '??' asegura que si un valor es undefined, se guarde 'null'.
        // Esto evita el error y permite guardar formularios incompletos.
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

// --- EXPORTACIÓN DEL SERVICIO ---
const dbService = {
  initDatabase,
  addUser,
  getUserByLogin,
  getUsers,
  deleteUser,
  updateUser,
};

export default dbService;
