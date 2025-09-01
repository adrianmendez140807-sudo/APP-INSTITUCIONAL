// database.js
import * as SQLite from "expo-sqlite";
import * as Crypto from 'expo-crypto';

// Abrimos la base de datos usando la nueva API síncrona, que es ideal para inicializar.
const db = SQLite.openDatabaseSync("users.db");

// --- Funciones del Módulo ---

// Nota: Se define `addUser` aquí para que `seedAdminUser` pueda llamarla.
const addUser = async (name, email, password, role) => {
  const hashedPassword = await Crypto.digestStringAsync(
    Crypto.CryptoDigestAlgorithm.SHA256,
    password
  );
  try {
    const result = await db.runAsync(
      "INSERT INTO users (name, email, password, role) VALUES (?, ?, ?, ?)",
      [name, email, hashedPassword, role]
    );
    console.log(`✅ Usuario agregado: ${name} (${role})`);
    return result;
  } catch (error) {
    console.error("❌ Error al insertar usuario:", error);
    throw error;
  }
};

// Función para crear un usuario admin por defecto si la base de datos está vacía.
const seedAdminUser = async () => {
  try {
    const users = await db.getAllAsync("SELECT * FROM users");
    if (users.length === 0) {
      console.log("🌱 No hay usuarios, creando usuario admin por defecto...");
      // Usamos una contraseña simple para el admin, pero se guardará hasheada.
      await addUser("Admin", "admin@institucion.com", "admin123", "docente");
      console.log("👤 Usuario admin creado con éxito (admin@institucion.com / admin123).");
    } else {
      console.log("👍 La base de datos ya tiene usuarios.");
    }
  } catch (error) {
    console.error("❌ Error al intentar crear el usuario admin por defecto:", error);
  }
};

// Inicializa la base de datos y crea el usuario admin si es necesario.
const initDatabase = async () => {
  try {
    await db.execAsync(`
      PRAGMA journal_mode = WAL;
      CREATE TABLE IF NOT EXISTS users (
          id INTEGER PRIMARY KEY AUTOINCREMENT,
          name TEXT NOT NULL,
          email TEXT UNIQUE NOT NULL,
          password TEXT NOT NULL,
          role TEXT NOT NULL CHECK(role IN ('docente','estudiante'))
      );
    `);
    console.log("📦 Tabla 'users' lista.");
    // Llama a la función para crear el admin si es la primera vez.
    await seedAdminUser();
  } catch (error) {
    console.error("❌ Error creando la tabla 'users':", error);
    throw error;
  }
};

// Obtener usuario por login
const getUserByLogin = async (email, password) => {
  try {
    // 1. Obtener el usuario solo por email.
    const user = await db.getFirstAsync("SELECT * FROM users WHERE email = ?", [email]);

    // Si el usuario no existe, retornamos null.
    if (!user) {
      console.log(`❌ Intento de login para un usuario no existente: ${email}`);
      return null;
    }

    // 2. Hasheamos la contraseña que el usuario acaba de ingresar para poder compararla.
    const inputHashedPassword = await Crypto.digestStringAsync(
      Crypto.CryptoDigestAlgorithm.SHA256,
      password
    );

    // 3. Comparamos el hash de la contraseña ingresada con el hash que tenemos guardado.
    const passwordsMatch = user.password === inputHashedPassword;

    if (passwordsMatch) {
      console.log(`✅ Usuario validado: ${user.name}`);
      return user; // ¡Éxito! Devolvemos el objeto de usuario.
    }

    // Si las contraseñas no coinciden, también retornamos null.
    console.log(`❌ Contraseña incorrecta para el usuario: ${email}`);
    return null; // Contraseña incorrecta.
  } catch (error) {
    console.error("❌ Error al validar usuario:", error);
    throw error; // Lanzamos el error para que sea manejado por quien llamó a la función.
  }
};

// Obtener todos los usuarios (útil para debuggear)
const getUsers = async () => {
  try {
    return await db.getAllAsync("SELECT id, name, email, role FROM users");
  } catch (error) {
    console.error("❌ Error al obtener usuarios:", error);
    throw error;
  }
};

// Eliminar un usuario por su ID
const deleteUser = async (id) => {
  try {
    const result = await db.runAsync("DELETE FROM users WHERE id = ?", [id]);
    console.log(`🗑 Usuario ${id} eliminado`);
    return result;
  } catch (error) {
    console.error("❌ Error al eliminar usuario:", error);
    throw error;
  }
};
// Actualizar usuario (excepto contraseña)
const updateUser = async (id, name, email, role) => {
  try {
    const result = await db.runAsync(
      "UPDATE users SET name = ?, email = ?, role = ? WHERE id = ?",
      [name, email, role, id]
    );
    console.log(`✏️ Usuario ${id} actualizado`);
    return result;
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
