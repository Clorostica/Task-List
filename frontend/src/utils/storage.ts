import type { Task } from "../types/tasks/task.types";
const NO_USER_TODO_TASKS_KEY = "tasks:nouser";

export const getTasks = (): Task[] => {
  try {
    const tasks = localStorage.getItem(NO_USER_TODO_TASKS_KEY);
    return tasks ? JSON.parse(tasks) : [];
  } catch (error) {
    console.error("Error reading from localStorage:", error);
    return [];
  }
};

export const saveTasks = (tasks: Task[]): void => {
  try {
    localStorage.setItem(NO_USER_TODO_TASKS_KEY, JSON.stringify(tasks));
  } catch (error) {
    console.error("Error saving to localStorage:", error);
  }
};
