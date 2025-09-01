// database.js
import * as SQLite from 'expo-sqlite';

// ✅ Conexión a la base de datos (modo async recomendado en SDK 53)
export const openDatabase = async () => {
  return await SQLite.openDatabaseAsync('myDatabase.db');
};

// ✅ Inicialización de tablas
export const initDatabase = async () => {
  try {
    const db = await openDatabase();

    // Crear tabla de usuarios (ejemplo)
    await db.execAsync(`
      CREATE TABLE IF NOT EXISTS users (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        name TEXT NOT NULL,
        email TEXT NOT NULL UNIQUE
      );
    `);

    // Crear tabla de servicios (ejemplo)
    await db.execAsync(`
      CREATE TABLE IF NOT EXISTS services (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        user_id INTEGER,
        service_name TEXT NOT NULL,
        date TEXT NOT NULL,
        FOREIGN KEY(user_id) REFERENCES users(id)
      );
    `);

    console.log("✅ Base de datos inicializada correctamente");
  } catch (error) {
    console.error("❌ Error al inicializar la base de datos:", error);
  }
};

// ✅ Insertar usuario
export const insertUser = async (name, email) => {
  try {
    const db = await openDatabase();
    await db.runAsync(
      "INSERT INTO users (name, email) VALUES (?, ?);",
      [name, email]
    );
    console.log("✅ Usuario insertado");
  } catch (error) {
    console.error("❌ Error al insertar usuario:", error);
  }
};

// ✅ Obtener usuarios
export const getUsers = async () => {
  try {
    const db = await openDatabase();
    const result = await db.getAllAsync("SELECT * FROM users;");
    return result;
  } catch (error) {
    console.error("❌ Error al obtener usuarios:", error);
    return [];
  }
};
