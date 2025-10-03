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
    if (!email) return res.status(400).json({ error: "Email is required" }); //Crear usuario

    const result = await pool.query( 
      "INSERT INTO users(email) VALUES($1) RETURNING *",
      [email] // Recibe JSON y extrae solo el email
    );
    res.status(201).json(result.rows[0]);
  } catch (err) {
    console.error(err);
    if (err.code === '23505') { //← Código PostgreSQL para "valor duplicado"
      return res.status(400).json({ error: "Email already exists" }); // Si el email ya existe, devuelve error específico. 
    }
    res.status(500).json({ error: "Database error" });       // Si hay otro error, error genérico
  }
});

//Obtener todos los usuarios
app.get("/users", async (_, res) => { // ← El _ significa "no uso req"
  try {
    const result = await pool.query("SELECT * FROM users"); 
    res.json(result.rows);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Database error" });
  }
});

//Obtener usuario específico
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

// POST - Crear nueva tarea
app.post("/tasks", async (req, res) => {
  try {
    const { user_id, status, text } = req.body;
    
    // Validaciones
    if (!user_id) return res.status(400).json({ error: "user_id is required" });
    if (!status) return res.status(400).json({ error: "status is required" });
    if (!text) return res.status(400).json({ error: "text is required" });

    // Verificar que el usuario existe
    const userCheck = await pool.query("SELECT id FROM users WHERE id = $1", [user_id]);
    if (userCheck.rows.length === 0) {
      return res.status(400).json({ error: "User does not exist" });
    }

    // Crear la tarea
    const result = await pool.query(
      "INSERT INTO task_list(user_id, status, text) VALUES($1, $2, $3) RETURNING *",
      [user_id, status, text]
    );
    
    res.status(201).json(result.rows[0]);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Database error" });
  }
});

// GET - Obtener tarea por ID
app.get("/tasks/:id", async (req, res) => {
  try {
    const { id } = req.params;

    const result = await pool.query("SELECT * FROM task_list WHERE id = $1", [id]);

    if (result.rows.length === 0) { 
      return res.status(404).json({ error: "Task not found" });
    }

    res.json(result.rows[0]);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Database error" }); //codigo de estado
  }
});

// GET - Obtener todas las tareas por user_id
app.get("/users/:userId/tasks", async (req, res) => {
  try {
    const { userId } = req.params; // con esto extraemoss solo el num y no userid: valor
    const { status } = req.query; // Filtro opcional por status

    // Verificar que el usuario existe
    const userCheck = await pool.query("SELECT id FROM users WHERE id = $1", [userId]);
    if (userCheck.rows.length === 0) {
      return res.status(404).json({ error: "User not found" });
    }

    // Construir query con filtro opcional
    let query = "SELECT * FROM task_list WHERE user_id = $1";
    let params = [userId];

    if (status) {
      query += " AND status = $2";
      params.push(status);
    }

    query += " ORDER BY id DESC"; // Más recientes primero

    const result = await pool.query(query, params);

    res.json({
      tasks: result.rows,
      total: result.rows.length
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Database error" });
  }
});

const PORT = 3000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});