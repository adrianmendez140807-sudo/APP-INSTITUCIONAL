// database.js
import * as SQLite from "expo-sqlite/next";

// Abrimos la base de datos (se crea si no existe)
const db = SQLite.openDatabaseSync("users.db");

// Función para inicializar la base de datos
export const initDatabase = async () => {
  try {
    await db.execAsync(`
      CREATE TABLE IF NOT EXISTS users (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        name TEXT NOT NULL,
        email TEXT UNIQUE NOT NULL,
        password TEXT NOT NULL,
        role TEXT NOT NULL CHECK(role IN ('docente', 'estudiante'))
      );
    `);
    console.log("📦 Tabla 'users' lista");
  } catch (error) {
    console.error("❌ Error al inicializar DB:", error);
  }
};

// Insertar un nuevo usuario (docente o estudiante)
export const addUser = async (name, email, password, role) => {
  try {
    await db.runAsync(
      "INSERT INTO users (name, email, password, role) VALUES (?, ?, ?, ?)",
      [name, email, password, role]
    );
    console.log(`✅ Usuario ${role} agregado: ${name}`);
  } catch (error) {
    console.error("❌ Error al agregar usuario:", error);
  }
};

// Obtener todos los usuarios
export const getUsers = async () => {
  try {
    const result = await db.getAllAsync("SELECT * FROM users");
    return result;
  } catch (error) {
    console.error("❌ Error al obtener usuarios:", error);
    return [];
  }
};

// Obtener usuario por correo (para login)
export const getUserByEmail = async (email, password) => {
  try {
    const result = await db.getFirstAsync(
      "SELECT * FROM users WHERE email = ? AND password = ?",
      [email, password]
    );
    return result;
  } catch (error) {
    console.error("❌ Error al buscar usuario:", error);
    return null;
  }
};

// Eliminar usuario por ID
export const deleteUser = async (id) => {
  try {
    await db.runAsync("DELETE FROM users WHERE id = ?", [id]);
    console.log(`🗑️ Usuario con id ${id} eliminado`);
  } catch (error) {
    console.error("❌ Error al eliminar usuario:", error);
  }
};

export default db;
