import * as SQLite from 'expo-sqlite';
import * as Crypto from 'expo-crypto';

// Abrimos la base de datos usando la nueva API síncrona, que es ideal para inicializar.
const db = SQLite.openDatabaseSync("users.db");

// --- Funciones del Módulo ---

// Añadir usuario con número de documento opcional (ajusta si lo usas)
const addUser = async (name, email, password, role, documentNumber = null) => {
  const hashedPassword = await Crypto.digestStringAsync(
    Crypto.CryptoDigestAlgorithm.SHA256,
    password
  );
  try {
    if (documentNumber) {
      await db.runAsync(
        "INSERT INTO users (name, email, password, role, documentNumber) VALUES (?, ?, ?, ?, ?)",
        [name, email, hashedPassword, role, documentNumber]
      );
    } else {
      await db.runAsync(
        "INSERT INTO users (name, email, password, role) VALUES (?, ?, ?, ?)",
        [name, email, hashedPassword, role]
      );
    }
    console.log(`✅ Usuario agregado: ${name} (${role})`);
    return true;
  } catch (error) {
    console.error("❌ Error al insertar usuario:", error);
    throw error;
  }
};

// Función para crear usuarios predeterminados si la base de datos está vacía.
const seedDefaultUsers = async () => {
  try {
    const users = await db.getAllAsync("SELECT * FROM users");
    if (users.length === 0) {
      console.log("🌱 No hay usuarios, creando usuarios predeterminados...");
      await addUser("Admin", "admin@institucion.com", "admin123", "docente");
      await addUser("Secretaria", "secretaria@institucion.com", "secretaria123", "secretaria");
      await addUser("Rector", "rector@institucion.com", "rector123", "rector");
      await addUser("Coordinador", "coordinador@institucion.com", "coordinador123", "coordinador");
      console.log("👤 Usuarios predeterminados creados con éxito.");
    } else {
      console.log("👍 La base de datos ya tiene usuarios.");
    }
  } catch (error) {
    console.error("❌ Error al intentar crear los usuarios predeterminados:", error);
  }
};

// Inicializa la base de datos y crea los usuarios predeterminados si es necesario.
const initDatabase = async () => {
  try {
    await db.execAsync(`
      PRAGMA journal_mode = WAL;
      CREATE TABLE IF NOT EXISTS users (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        name TEXT NOT NULL,
        email TEXT UNIQUE NOT NULL,
        password TEXT NOT NULL,
        role TEXT NOT NULL CHECK(role IN ('docente','estudiante','secretaria','rector','coordinador')),
        documentNumber TEXT UNIQUE
      );
    `);
    console.log("📦 Tabla 'users' lista.");
    await seedDefaultUsers();
  } catch (error) {
    console.error("❌ Error creando la tabla 'users':", error);
    throw error;
  }
};

// Obtener usuario por login
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

// Obtener todos los usuarios (útil para debuggear)
const getUsers = async () => {
  try {
    const users = await db.getAllAsync("SELECT * FROM users");
    return users;
  } catch (error) {
    console.error("❌ Error al obtener usuarios:", error);
    return [];
  }
};

// Eliminar un usuario por su ID
const deleteUser = async (id) => {
  try {
    await db.runAsync("DELETE FROM users WHERE id = ?", [id]);
    console.log(`🗑️ Usuario eliminado: ${id}`);
    return true;
  } catch (error) {
    console.error("❌ Error al eliminar usuario:", error);
    throw error;
  }
};

// Actualizar usuario (excepto contraseña)
const updateUser = async (id, name, email, role, documentNumber = null) => {
  try {
    if (documentNumber) {
      await db.runAsync(
        "UPDATE users SET name = ?, email = ?, role = ?, documentNumber = ? WHERE id = ?",
        [name, email, role, documentNumber, id]
      );
    } else {
      await db.runAsync(
        "UPDATE users SET name = ?, email = ?, role = ? WHERE id = ?",
        [name, email, role, id]
      );
    }
    console.log(`✏️ Usuario actualizado: ${id}`);
    return true;
  } catch (error) {
    console.error("❌ Error al actualizar usuario:", error);
    throw error;
  }
};

// --- Exportación del Servicio ---

export const dbService = {
  initDatabase,
  addUser,
  getUserByLogin,
  getUsers,
  deleteUser,
  updateUser,
};

export default dbService;
