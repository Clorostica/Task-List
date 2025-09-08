const express = require("express");
const { Pool } = require("pg");

const app = express();
app.use(express.json());

const pool = new Pool({
  user: "user",
  host: "localhost",
  database: "db",
  password: "pass",
  port: 5432,
});

app.get("/", (_, res) => {
  res.send("Healthcheck");
});

app.post("/users", async (req, res) => {
  try {
    const { email } = req.body;
    if (!email) return res.status(400).json({ error: "Email is required" });

    const result = await pool.query(
      "INSERT INTO users(email) VALUES($1) RETURNING *",
      [email]
    );
    res.status(201).json(result.rows[0]);
  } catch (err) {
    console.error(err);
    if (err.code === '23505') {
      return res.status(400).json({ error: "Email already exists" });
    }
    res.status(500).json({ error: "Database error" });
  }
});

app.get("/users", async (_, res) => {
  try {
    const result = await pool.query("SELECT * FROM users");
    res.json(result.rows);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Database error" });
  }
});

app.get("/users/:id", async (req, res) => {
  try {
    const { id } = req.params;

    let result = await pool.query("SELECT * FROM users WHERE id = $1", [id]);

    if (result.rows.length === 0) {
      return res.status(404).json({ error: "User not found" });
    }

    res.json(result.rows[0]);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Database error" });
  }
});

const PORT = 3000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
