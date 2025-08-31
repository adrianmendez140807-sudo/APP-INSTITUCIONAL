// database/db.js
import * as SQLite from "expo-sqlite";

// Apertura de la base de datos
const db = SQLite.openDatabase("app.db");

// Inicializar la base de datos con usuarios base
export const initDB = () => {
  db.transaction((tx) => {
    tx.executeSql(
      `CREATE TABLE IF NOT EXISTS users (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        username TEXT UNIQUE,
        password TEXT,
        role TEXT
      );`
    );

    // Usuarios base del sistema
    const defaultUsers = [
      { username: "secretaria", password: "1234", role: "Secretaria" },
      { username: "rector", password: "1234", role: "Rector" },
      { username: "coordinacion", password: "1234", role: "Coordinacion" },
    ];

    defaultUsers.forEach((user) => {
      tx.executeSql(
        `INSERT OR IGNORE INTO users (username, password, role) VALUES (?, ?, ?);`,
        [user.username, user.password, user.role]
      );
    });
  });
};

// Agregar usuario (Secretaría puede añadir docentes y estudiantes)
export const addUser = (username, password, role, callback) => {
  db.transaction((tx) => {
    tx.executeSql(
      `INSERT INTO users (username, password, role) VALUES (?, ?, ?);`,
      [username, password, role],
      (_, result) => callback(true),
      (_, error) => {
        console.log("Error al agregar usuario:", error);
        callback(false);
      }
    );
  });
};

// Validar usuario en el login
export const validateUser = (username, password, callback) => {
  db.transaction((tx) => {
    tx.executeSql(
      `SELECT * FROM users WHERE username = ? AND password = ?;`,
      [username, password],
      (_, { rows }) => {
        if (rows.length > 0) {
          callback(rows._array[0]); // Retorna el usuario
        } else {
          callback(null);
        }
      }
    );
  });
};

// Obtener todos los usuarios (ejemplo: lista de estudiantes/docentes)
export const getUsersByRole = (role, callback) => {
  db.transaction((tx) => {
    tx.executeSql(
      `SELECT * FROM users WHERE role = ?;`,
      [role],
      (_, { rows }) => callback(rows._array),
      (_, error) => console.log("Error al obtener usuarios:", error)
    );
  });
};

export default db;
