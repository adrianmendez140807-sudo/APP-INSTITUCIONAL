import * as SQLite from 'expo-sqlite';
import * as Crypto from 'expo-crypto';

const db = SQLite.openDatabaseSync("users.db");

// Añadir usuario con número de documento opcional
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
    // Si el error es por usuario existente, ignóralo
    if (error.message && error.message.includes('UNIQUE constraint failed')) {
      return false;
    }
    console.error("❌ Error al insertar usuario:", error);
    throw error;
  }
};

// Crea los usuarios principales si no existen
const seedMainUsers = async () => {
  const mainUsers = [
    {
      name: "Secretaria",
      email: "secretaria@institucion.com",
      password: "secretaria123",
      role: "secretaria",
      documentNumber: "10000001"
    },
    {
      name: "Rector",
      email: "rector@institucion.com",
      password: "rector123",
      role: "rector",
      documentNumber: "10000002"
    },
    {
      name: "Coordinador",
      email: "coordinador@institucion.com",
      password: "coordinador123",
      role: "coordinador",
      documentNumber: "10000003"
    }
  ];

  for (const user of mainUsers) {
    // Verifica si el usuario ya existe por email
    const exists = await db.getFirstAsync(
      "SELECT * FROM users WHERE email = ?",
      [user.email]
    );
    if (!exists) {
      await addUser(user.name, user.email, user.password, user.role, user.documentNumber);
    }
  }
};

// Inicializa la base de datos y realiza migración si es necesario
const initDatabase = async () => {
  try {
    await db.execAsync(`
      PRAGMA journal_mode = WAL;
      CREATE TABLE IF NOT EXISTS users (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        name TEXT NOT NULL,
        email TEXT UNIQUE NOT NULL,
        password TEXT NOT NULL,
        role TEXT NOT NULL CHECK(role IN ('docente','estudiante','secretaria','rector','coordinador'))
      );
    `);

    // Intentar agregar la columna documentNumber si no existe (sin UNIQUE)
    try {
      await db.execAsync(`ALTER TABLE users ADD COLUMN documentNumber TEXT;`);
      console.log("🆕 Columna documentNumber agregada.");
    } catch (err) {
      // Si ya existe, ignora el error
      if (err.message && err.message.includes('duplicate column name')) {
        console.log("ℹ️ La columna documentNumber ya existe.");
      } else if (err.message && err.message.includes('no such table')) {
        // La tabla no existe, ignora
      } else {
        throw err;
      }
    }

    console.log("📦 Tabla 'users' lista.");
    await seedMainUsers(); // Crea los usuarios principales si no existen
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

// Obtener todos los usuarios
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
