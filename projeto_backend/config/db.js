import mysql from "mysql2/promise";

export let db;

try {
  db = await mysql.createConnection({
    host: "localhost",
    user: "root",
    password: "casagrande",
    database: "bdBibliotec",
    port: 3306,
  });

  console.log("✅ Conectado ao banco de dados bdBibliotec!");
} catch (err) {
  console.error("❌ Erro ao conectar ao banco de dados:", err);
}