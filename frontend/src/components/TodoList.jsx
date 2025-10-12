import React from "react";
import Column from "./Column";
import _ from "lodash";
import { v4 as uuidv4 } from "uuid";

import { getTasks, saveTasks } from "../utils/storage";

const API_URL = import.meta.env.VITE_API;

export default function TodoList({
  todos,
  setTodos,
  search,
  token,
  isAuthenticated,
}) {
  function getColorClass() {
    const colors = [
      "bg-gradient-to-br from-blue-100 to-blue-200 border-blue-400",
      "bg-gradient-to-br from-green-100 to-green-200 border-green-400",
      "bg-gradient-to-br from-yellow-100 to-yellow-200 border-yellow-400",
      "bg-gradient-to-br from-pink-100 to-pink-200 border-pink-400",
      "bg-gradient-to-br from-purple-100 to-purple-200 border-purple-400",
      "bg-gradient-to-br from-indigo-100 to-indigo-200 border-indigo-400",
      "bg-gradient-to-br from-red-100 to-red-200 border-red-400",
      "bg-gradient-to-br from-orange-100 to-orange-200 border-orange-400",
    ];
    return colors[Math.floor(Math.random() * colors.length)];
  }
  const colorClass = getColorClass();
  const filteredTodos = todos.filter((t) =>
    (t.text || "").toLowerCase().includes((search || "").toLowerCase())
  );

  const todoTasks = filteredTodos.filter((t) => t.status === "todo");
  const progressTasks = filteredTodos.filter((t) => t.status === "progress");
  const completedTasks = filteredTodos.filter((t) => t.status === "completed");

  const addTask = async (status = "todo") => {
    const taskId = uuidv4();
    const newTask = {
      id: taskId,
      status,
      text: "",
      colorClass,
    };
    setTodos((prevTodos) => [...prevTodos, newTask]);

    if (!isAuthenticated) {
      const existingTasks = getTasks();
      saveTasks([...existingTasks, newTask]);
      return;
    }

    try {
      const res = await fetch(`${API_URL}/tasks`, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify(newTask),
      });

      if (!res.ok) {
        throw new Error(`Error: ${res.status}`);
      }
    } catch (error) {
      console.error("Error creating task:", error);
      setTodos(todos);
      alert("Oops! something went wrong creating your task :(");
    }
  };

  // Eliminar tarea
  const deleteTask = async (taskId) => {
    const tasks = getTasks();

    setTodos((prev) => prev.filter((task) => task.id !== taskId));

    if (!isAuthenticated) {
      const updatedTasks = tasks.filter((task) => task.id !== taskId);
      saveTasks(updatedTasks);
      return;
    }

    try {
      const res = await fetch(`${API_URL}/tasks/${taskId}`, {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (!res.ok) {
        throw new Error(`Error: ${res.status}`);
      }
    } catch (error) {
      console.error("Error deleting task:", error);
      setTodos(todos);
      alert("Oops! something went wrong deleting your task :(");
    }
  };

  // Editar tarea
  const handleEdit = async (id, newText) => {
    const task = todos.find((task) => task.id === id);
    if (!task) return;

    const updatedTask = { ...task, text: newText };
    setTodos((prevTodos) =>
      prevTodos.map((task) => (task.id === id ? updatedTask : task))
    );

    if (!isAuthenticated) {
      const localTasks = getTasks();
      const updatedTasks = localTasks.map((task) =>
        task.id === id ? updatedTask : task
      );
      saveTasks(updatedTasks);
      return;
    }

    try {
      const res = await fetch(`${API_URL}/tasks/${id}`, {
        method: "PUT",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          text: newText,
          status: task.status,
        }),
      });

      if (!res.ok) {
        throw new Error(`Error: ${res.status}`);
      }
    } catch (err) {
      console.error("Error editing task:", err);
      setTodos(todos);
      alert("Oops! something went wrong editing your task :(");
    }
  };

  const handleStatusChange = async (taskId, newStatus, position = null) => {
    const task = todos.find((task) => task.id === taskId);
    const updatedTask = { ...task, status: newStatus };
    const filteredTodos = todos.filter((task) => task.id !== taskId);
    const updatedTasks =
      position === 0
        ? [updatedTask, ...filteredTodos]
        : [...filteredTodos, updatedTask];
    setTodos(updatedTasks);

    if (!task) {
      console.error("Task not found:", taskId);
      return;
    }

    if (!isAuthenticated) {
      saveTasks(updatedTasks);
      return;
    }

    try {
      const res = await fetch(`${API_URL}/tasks/${taskId}`, {
        method: "PUT",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          text: task.text,
          status: newStatus,
        }),
      });

      if (!res.ok) throw new Error(`Error: ${res.status}`);
    } catch (err) {
      console.error("Error editing task:", err);
      alert("Oops! something went wrong editing your task :(");
      setTodos(todos);
    }

    console.log("✅ Task moved in API:", updatedTask);
  };
  return (
    <div className="flex flex-col sm:flex-row gap-4 sm:gap-0 overflow-x-auto pb-4">
      <Column
        title="📝 To Do"
        tasks={todoTasks}
        onDelete={deleteTask}
        onEdit={handleEdit}
        onStatusChange={handleStatusChange}
        bgColor="bg-gradient-to-r from-slate-600 to-slate-700"
        textColor="text-white"
        columnStatus="todo"
        addTask={addTask}
      />
      <Column
        title="🚀 In Progress"
        tasks={progressTasks}
        onDelete={deleteTask}
        onEdit={handleEdit}
        onStatusChange={handleStatusChange}
        bgColor="bg-gradient-to-r from-yellow-500 to-yellow-600"
        textColor="text-white"
        columnStatus="progress"
        addTask={addTask}
      />
      <Column
        title="✅ Completed"
        tasks={completedTasks}
        onDelete={deleteTask}
        onEdit={handleEdit}
        onStatusChange={handleStatusChange}
        bgColor="bg-gradient-to-r from-green-500 to-green-600"
        textColor="text-white"
        columnStatus="completed"
        addTask={addTask}
      />
    </div>
  );
}
