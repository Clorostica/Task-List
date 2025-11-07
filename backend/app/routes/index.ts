import { Router } from "express";
import tasks from "./tasks";
import users from "./users";

const router = Router();

router.use("/tasks", tasks);
router.use("/users", users);

export default router;
