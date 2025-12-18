const express = require("express");
const { Pool } = require("pg");

const app = express();
const port = 3000;

// Підключення до БД
const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
});

app.use(express.json());

// Маршрут для прийому повідомлень
app.post("/api/message", async (req, res) => {
  try {
    const { name, email, message } = req.body;
    const queryText =
      "INSERT INTO messages(name, email, message) VALUES($1, $2, $3)";
    await pool.query(queryText, [name, email, message]);

    console.log("✅ Повідомлення збережено:", name);
    res.status(201).json({ status: "success" });
  } catch (err) {
    console.error("❌ Помилка:", err);
    res.status(500).json({ status: "error" });
  }
});

// Функція запуску з повторними спробами (щоб дочекатися БД)
async function startServer() {
  let retries = 5;
  while (retries) {
    try {
      await pool.query("SELECT 1"); // Перевірка зв'язку

      // Створення таблиці, якщо її немає
      await pool.query(`
        CREATE TABLE IF NOT EXISTS messages (
          id SERIAL PRIMARY KEY,
          name VARCHAR(100),
          email VARCHAR(100),
          message TEXT,
          created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
        );
      `);
      console.log("✅ База даних готова!");

      app.listen(port, () => {
        console.log(`🚀 Сервер працює на порту ${port}`);
      });
      return;
    } catch (err) {
      console.log(`⏳ Чекаємо на БД... (${retries} спроб залишилось)`);
      retries -= 1;
      await new Promise((res) => setTimeout(res, 5000));
    }
  }
  process.exit(1);
}

startServer();
