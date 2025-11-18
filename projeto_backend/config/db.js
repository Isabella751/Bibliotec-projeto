import mysql from "mysql2/promise";

// ============================
//  Conexão com o MariaDB
// ============================
export const db = await mysql.createConnection({
  host: "localhost",
  user: "root",
  password: "Senai2025",
  database: "dblivrariabibliotec",
  port: 3306,
});

console.log("✅ Conectado ao banco de dados dblivrariabibliotec!");