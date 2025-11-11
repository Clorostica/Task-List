import { Router } from "express";
import tasks from "./tasks.js";
import users from "./users.js";

const router = Router();

router.use("/tasks", tasks);
router.use("/users", users);

export default router;

