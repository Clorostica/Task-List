const { Pool } = require("pg");
const express = require("express");
const cors = require("cors"); 
const { expressjwt } = require("express-jwt");
const jwksRsa =  require("jwks-rsa");
const dotenv = require("dotenv")
dotenv.config();

const checkJwt = expressjwt({
  secret: jwksRsa.expressJwtSecret({
    cache: true,
    rateLimit: true,
    jwksRequestsPerMinute: 5,
    jwksUri: process.env.AUTH0_JWKS_URI,
  }),
  audience: process.env.AUTH0_AUDIENCE,
  issuer: process.env.AUTH0_ISSUER,
  algorithms: ["RS256"],
});

const app = express();
app.use(express.json());
app.use(cors()); 

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

app.post("/users", checkJwt, async (req, res) => {
  try {
    console.log(req.auth)
    const { sub, email } = req.auth;
  
    if (!sub || !email) return res.status(400).json({ error: "Invalid token" }); //Crear usuario

    const result = await pool.query( 
      "INSERT INTO users(id, email) VALUES($1, $2) RETURNING *",
      [sub, email] // Recibe JSON y extrae solo el email
    );
    res.status(201).json(result.rows[0]);
  } catch (err) {
    console.error(err);
    if (err.code === '23505') { //← Código PostgreSQL para "valor duplicado"
      return res.status(400).json({ error: "User already exists" }); // Si el email ya existe, devuelve error específico. 
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
app.get("/users/:email", async (req, res) => {
  try {
    const { email } = req.params;

    let result = await pool.query("SELECT * FROM users WHERE email = $1", [email]);

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
    
    if (!user_id) return res.status(400).json({ error: "user_id is required" });
    if (!status) return res.status(400).json({ error: "status is required" });

    const userCheck = await pool.query("SELECT id FROM users WHERE id = $1", [user_id]);
    if (userCheck.rows.length === 0) {
      return res.status(400).json({ error: "User does not exist" });
    }

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

// PUT - Editar tarea
app.put("/tasks/:taskId", async (req, res) => {
  try {
    const { taskId } = req.params
    const { status, text } = req.body;
    
    if (!taskId) return res.status(400).json({ error: "taskId is required" });
    if (!status) return res.status(400).json({ error: "status is required" });

    const tasklist = await pool.query(
      "SELECT * FROM task_list WHERE id = $1",
      [taskId]
    );

    if (tasklist.rows.length === 0) {
      return res.status(404).json({ error: "Task not found" });
    }

    const result = await pool.query(
   "UPDATE task_list SET status = $1, text = $2 WHERE id = $3 RETURNING *",
      [status, text, taskId]
    );
    
    res.status(201).json(result.rows[0]);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Unknown error" });
  }
});

// PUT - Cambiar el estado de la tarea
app.put("/tasks/:taskId", async (req, res) => {
  try {
    const { taskId } = req.params
    const { status, text } = req.body;
    
    if (!taskId) return res.status(400).json({ error: "taskId is required" });
    if (!status) return res.status(400).json({ error: "status is required" });

    const tasklist = await pool.query(
      "SELECT * FROM task_list WHERE id = $1",
      [taskId]
    );

    if (tasklist.rows.length === 0) {
      return res.status(404).json({ error: "Task not found" });
    }

    const result = await pool.query(
   "UPDATE task_list SET status = $1, text = $2 WHERE id = $3 RETURNING *",
      [status, text, taskId]
    );
    
    res.status(201).json(result.rows[0]);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Internal server error" });
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
    res.status(500).json({ error: "Database error" }); 
  }
});

app.delete("/tasks/:id", async (req, res) => {
  try {
    const { id } = req.params;

    const result = await pool.query(
      "SELECT * FROM task_list WHERE id = $1",
      [id]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ error: "Task not found" });
    }

    await pool.query("DELETE FROM task_list WHERE id = $1", [id]);

    res.json({
      message: "Task deleted successfully",
      deletedTask: result.rows[0], 
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Database error" });
  }
});

// GET - Obtener todas las tareas por user_id
app.get("/users/:userId/tasks", async (req, res) => {
  try {
    const { userId } = req.params; 
    const { status } = req.query; 

    const userCheck = await pool.query("SELECT id FROM users WHERE id = $1", [userId]);
    if (userCheck.rows.length === 0) {
      return res.status(404).json({ error: "User not found" });
    }

    let query = "SELECT * FROM task_list WHERE user_id = $1";
    let params = [userId];

    if (status) {
      query += " AND status = $2";
      params.push(status);
    }

    query += " ORDER BY id DESC"; 

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