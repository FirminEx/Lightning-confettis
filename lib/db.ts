import Database from 'better-sqlite3';

const db = new Database('app.db');

db.exec(`
  CREATE TABLE IF NOT EXISTS users (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    username TEXT UNIQUE NOT NULL,
    email TEXT UNIQUE NOT NULL,
    password TEXT NOT NULL,
    isPremiumUser BOOLEAN DEFAULT 0
  )
`);

db.exec(`
  CREATE TABLE IF NOT EXISTS invoices (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    email TEXT NOT NULL,
    hash TEXT NOT NULL,
    request TEXT NOT NULL,
    FOREIGN KEY (email) REFERENCES users(email)
  )
`);

// Update these functions to use email
export function createInvoice(email: string, hash: string, request: string) {
  const stmt = db.prepare('INSERT INTO invoices (email, hash, request) VALUES (?, ?, ?)');
  return stmt.run(email, hash, request);
}

export function getInvoiceByEmail(email: string) {
  const stmt = db.prepare('SELECT * FROM invoices WHERE email = ?');
  return stmt.get(email);
}

export function updateUserPremiumStatus(email: string) {
  const stmt = db.prepare('UPDATE users SET isPremiumUser = 1 WHERE email = ?');
  return stmt.run(email);
}

export function createUser(username: string, email: string, password: string) {
  const stmt = db.prepare('INSERT INTO users (username, email, password, isPremiumUser) VALUES (?, ?, ?, 0)');
  return stmt.run(username, email, password);
}

export function getUser(username: string) {
  const stmt = db.prepare('SELECT * FROM users WHERE username = ?');
  return stmt.get(username);
}

export function getUserByEmail(email: string) {
  const stmt = db.prepare('SELECT * FROM users WHERE email = ?');
  return stmt.get(email);
}

export default db;
