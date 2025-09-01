// database.js
import * as SQLite from "expo-sqlite";

// Abrir base de datos de forma asíncrona
let db;

export async function openDB() {
  if (!db) {
    db = await SQLite.openDatabaseAsync("lavadero.db");
  }
  return db;
}

// Crear tablas si no existen
export async function initDB() {
  const db = await openDB();

  // Tabla de usuarios
  await db.execAsync(`
    CREATE TABLE IF NOT EXISTS users (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      username TEXT UNIQUE,
      password TEXT
    );
  `);

  // Tabla de servicios agendados
  await db.execAsync(`
    CREATE TABLE IF NOT EXISTS servicios (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      nombre TEXT,
      fecha TEXT,
      hora TEXT,
      usuario_id INTEGER,
      FOREIGN KEY(usuario_id) REFERENCES users(id)
    );
  `);
}
