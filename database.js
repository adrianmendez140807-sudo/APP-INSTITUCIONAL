import * as SQLite from 'expo-sqlite';

const db = SQLite.openDatabase('app.db');

// Inicialización de la BD con usuarios pre-registrados
export const initDB = () => {
  db.transaction(tx => {
    tx.executeSql(
      `CREATE TABLE IF NOT EXISTS users (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        username TEXT UNIQUE,
        password TEXT,
        role TEXT
      );`
    );

    // Insertar usuarios iniciales (Secretaría, Rector, Coordinación)
    const defaultUsers = [
      { username: 'secretaria', password: '1234', role: 'Secretaria' },
      { username: 'rector', password: '1234', role: 'Rector' },
      { username: 'coordinacion', password: '1234', role: 'Coordinacion' },
    ];

    defaultUsers.forEach(user => {
      tx.executeSql(
        `INSERT OR IGNORE INTO users (username, password, role) VALUES (?, ?, ?);`,
        [user.username, user.password, user.role]
      );
    });
  });
};

// Agregar usuario (para estudiantes y docentes desde Secretaría)
export const addUser = (username, password, role, callback) => {
  db.transaction(tx => {
    tx.executeSql(
      `INSERT INTO users (username, password, role) VALUES (?, ?, ?);`,
      [username, password, role],
      (_, result) => callback(true),
      (_, error) => {
        console.log(error);
        callback(false);
      }
    );
  });
};

// Validar usuario en el login
export const validateUser = (username, password, callback) => {
  db.transaction(tx => {
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
