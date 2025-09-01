// database.js
import * as SQLite from 'expo-sqlite';

// ✅ Ahora se usa openDatabaseAsync (asíncrono)
let db;

export async function initDatabase() {
  if (!db) {
    db = await SQLite.openDatabaseAsync('lavadero.db');

    // Crear tablas si no existen
    await db.execAsync(`
      CREATE TABLE IF NOT EXISTS usuarios (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        nombre TEXT NOT NULL,
        correo TEXT NOT NULL,
        contrasena TEXT NOT NULL
      );

      CREATE TABLE IF NOT EXISTS servicios (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        nombre TEXT NOT NULL,
        precio REAL NOT NULL
      );

      CREATE TABLE IF NOT EXISTS agendados (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        usuario_id INTEGER,
        servicio_id INTEGER,
        fecha TEXT NOT NULL,
        FOREIGN KEY(usuario_id) REFERENCES usuarios(id),
        FOREIGN KEY(servicio_id) REFERENCES servicios(id)
      );
    `);
  }
  return db;
}

// ✅ Obtener la instancia de la base de datos ya inicializada
export function getDatabase() {
  if (!db) throw new Error('La base de datos no está inicializada. Llama primero a initDatabase()');
  return db;
}
