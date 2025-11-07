import { Router } from "express";
import { pool } from "@/db/pool";
import { authenticate } from "@/middleware/auth";

const router = Router();

// GET - Obtener todas las tareas por user_id
router.get("/", authenticate, async (req, res) => {
  if (!req.auth) return res.status(401).json({ error: "Auth is required" });

  try {
    const { sub } = req.auth;
    const { status } = req.query;

    let query = "SELECT * FROM task_list WHERE user_id = $1";
    const params = [sub];

    if (status) {
      query += " AND status = $2";
      params.push(status.toString());
    }

    query += " ORDER BY id DESC";

    const result = await pool.query(query, params);

    res.json({ tasks: result.rows, total: result.rows.length });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Database error" });
  }
});

// POST - Crear nueva tarea

router.post("/", authenticate, async (req, res) => {
  if (!req.auth) {
    return res.status(401).json({ error: "Auth is required" });
  }

  try {
    const { sub } = req.auth;
    const userId = sub;
    const { id, status, text, colorClass } = req.body;

    if (!userId || !status) {
      return res.status(400).json({
        error: !userId ? "Invalid Token" : "status is required",
      });
    }
    const userCheck = await pool.query("SELECT id FROM users WHERE id = $1", [
      userId,
    ]);
    if (userCheck.rows.length === 0) {
      return res.status(400).json({ error: "User does not exist" });
    }

    const result = await pool.query(
      "INSERT INTO task_list(id, user_id, status, text, color_class) VALUES($1, $2, $3, $4, $5) RETURNING *",
      [id, userId, status, text, colorClass]
    );

    res.status(201).json(result.rows[0]);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Database error" });
  }
});

// PUT - Editar tarea
router.put("/:taskId", authenticate, async (req, res) => {
  if (!req.auth) {
    return res.status(401).json({ error: "Auth is required" });
  }

  try {
    const { sub } = req.auth;
    const { taskId } = req.params;
    const { status, text } = req.body;

    if (!taskId) return res.status(400).json({ error: "taskId is required" });
    if (!status) return res.status(400).json({ error: "status is required" });

    const tasklist = await pool.query("SELECT * FROM task_list WHERE id = $1", [
      taskId,
    ]);

    if (tasklist.rows.length === 0) {
      return res.status(404).json({ error: "Task not found" });
    }

    if (tasklist.rows[0].user_id !== sub)
      return res.status(400).json({ error: "User does not own task" });

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

router.delete("/:id", authenticate, async (req, res) => {
  if (!req.auth) {
    return res.status(401).json({ error: "Auth is required" });
  }

  try {
    const { sub } = req.auth;
    const { id } = req.params;

    const result = await pool.query("SELECT * FROM task_list WHERE id = $1", [
      id,
    ]);

    if (result.rows.length === 0) {
      return res.status(404).json({ error: "Task not found" });
    }

    const task = result.rows[0];

    if (task.user_id !== sub)
      res.status(400).json({ error: "User does not own task" });

    await pool.query("DELETE FROM task_list WHERE id = $1", [id]);

    res.json({
      message: "Task deleted successfully",
      deletedTask: task,
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Database error" });
  }
});

export default router;
