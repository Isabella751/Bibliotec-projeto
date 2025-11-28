import mysql from "mysql2/promise";

export let db;

try {
  db = await mysql.createConnection({
    host: "localhost",
    user: "root",
    password: "1234",
    database: "bdBibliotec",
    port: 3304,
  });

  console.log("✅ Conectado ao banco de dados bdBibliotec!");
} catch (err) {
  console.error("❌ Erro ao conectar ao banco de dados:", err);
}