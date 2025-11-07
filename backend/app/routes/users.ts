import { Router } from "express";
import { pool } from "@/db/pool";
import { authenticate } from "@/middleware/auth";
import { DatabaseError } from "pg";

const router = Router();

// GET - Obtener usuario específico
router.get("/", authenticate, async (req, res) => {
  if (!req.auth) return res.status(401).json({ error: "Auth is required" });

  try {
    const { sub, email } = req.auth;

    const result = await pool.query("SELECT * FROM users WHERE id = $1", [sub]);
    if (!result.rows[0])
      return res.status(400).json({ error: "No user found" });

    res.json(result.rows[0]);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Database error" });
  }
});

// POST - crear usuario
router.post("/", authenticate, async (req, res) => {
  if (!req.auth) return res.status(401).json({ error: "Auth is required" });

  try {
    const { sub, email } = req.auth;
    if (!sub || !email) return res.status(400).json({ error: "Invalid token" });

    const result = await pool.query(
      "INSERT INTO users(id, email) VALUES($1, $2) RETURNING *",
      [sub, email]
    );
    res.status(201).json(result.rows[0]);
  } catch (err) {
    console.error(err);
    if (err instanceof DatabaseError && err.code === "23505")
      return res.status(400).json({ error: "User already exists" });
    res.status(500).json({ error: "Database error" });
  }
});

export default router;
