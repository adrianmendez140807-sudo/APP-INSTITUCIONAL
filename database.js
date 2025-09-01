// database.js
import * as SQLite from "expo-sqlite";

// Abrimos o creamos la base de datos
const db = SQLite.openDatabase("users.db");

// Inicializa la base de datos
export const initDatabase = () => {
  return new Promise((resolve, reject) => {
    db.transaction((tx) => {
      tx.executeSql(
        `CREATE TABLE IF NOT EXISTS users (
          id INTEGER PRIMARY KEY AUTOINCREMENT,
          name TEXT NOT NULL,
          email TEXT UNIQUE NOT NULL,
          password TEXT NOT NULL,
          role TEXT NOT NULL CHECK(role IN ('docente','estudiante'))
        );`,
        [],
        () => {
          console.log("📦 Tabla 'users' lista");
          resolve();
        },
        (_, error) => {
          console.error("❌ Error creando tabla:", error);
          reject(error);
        }
      );
    });
  });
};

// Agregar usuario
export const addUser = (name, email, password, role) => {
  return new Promise((resolve, reject) => {
    db.transaction((tx) => {
      tx.executeSql(
        "INSERT INTO users (name, email, password, role) VALUES (?, ?, ?, ?)",
        [name, email, password, role],
        (_, result) => {
          console.log(`✅ Usuario agregado: ${name} (${role})`);
          resolve(result);
        },
        (_, error) => {
          console.error("❌ Error al insertar usuario:", error);
          reject(error);
        }
      );
    });
  });
};

// Obtener todos los usuarios
export const getUsers = () => {
  return new Promise((resolve, reject) => {
    db.transaction((tx) => {
      tx.executeSql(
        "SELECT * FROM users",
        [],
        (_, { rows }) => resolve(rows._array),
        (_, error) => {
          console.error("❌ Error al obtener usuarios:", error);
          reject(error);
        }
      );
    });
  });
};

// Obtener usuario por login
export const getUserByEmail = (email, password) => {
  return new Promise((resolve, reject) => {
    db.transaction((tx) => {
      tx.executeSql(
        "SELECT * FROM users WHERE email = ? AND password = ?",
        [email, password],
        (_, { rows }) => resolve(rows._array[0]),
        (_, error) => {
          console.error("❌ Error al validar usuario:", error);
          reject(error);
        }
      );
    });
  });
};

// Eliminar usuario
export const deleteUser = (id) => {
  return new Promise((resolve, reject) => {
    db.transaction((tx) => {
      tx.executeSql(
        "DELETE FROM users WHERE id = ?",
        [id],
        (_, result) => {
          console.log(`🗑 Usuario ${id} eliminado`);
          resolve(result);
        },
        (_, error) => {
          console.error("❌ Error al eliminar usuario:", error);
          reject(error);
        }
      );
    });
  });
};

export default db;
