import * as SQLite from "expo-sqlite";

// Crear o abrir base de datos
const db = SQLite.openDatabaseSync("institucion.db");

// Inicializar tablas
export const initDB = async () => {
  await db.execAsync(`
    CREATE TABLE IF NOT EXISTS users (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      username TEXT UNIQUE,
      password TEXT,
      role TEXT
    );
  `);

  // Insertar usuarios base (si no existen)
  const baseUsers = [
    { username: "rectoria", password: "1234", role: "rectoria" },
    { username: "coordinacion", password: "1234", role: "coordinacion" },
    { username: "secretaria", password: "1234", role: "secretaria" }
  ];

  for (let user of baseUsers) {
    await db.runAsync(
      "INSERT OR IGNORE INTO users (username, password, role) VALUES (?, ?, ?)",
      [user.username, user.password, user.role]
    );
  }
};

// Login
export const loginUser = async (username, password) => {
  const result = await db.getFirstAsync(
    "SELECT * FROM users WHERE username = ? AND password = ?",
    [username, password]
  );
  return result;
};

// Agregar usuario
export const addUser = async (username, password, role) => {
  await db.runAsync(
    "INSERT INTO users (username, password, role) VALUES (?, ?, ?)",
    [username, password, role]
  );
};

// Obtener usuarios
export const getUsers = async () => {
  return await db.getAllAsync("SELECT * FROM users");
};

// Eliminar usuario
export const deleteUser = async (id) => {
  await db.runAsync("DELETE FROM users WHERE id = ?", [id]);
};

export default db;
