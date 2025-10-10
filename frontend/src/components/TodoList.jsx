import React from "react";
import Column from "./Column";
import _ from "lodash";

const API_URL = "http://localhost:3000";

export default function TodoList({
  todos,
  setTodos,
  search,
  token,
  isAuthenticated,
}) {
  const STORAGE_KEY = "nouser_tasks";

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

  const getLocalTasks = () => {
    try {
      const tasks = localStorage.getItem(STORAGE_KEY);
      return tasks ? JSON.parse(tasks) : [];
    } catch (error) {
      console.error("Error reading from localStorage:", error);
      return [];
    }
  };
  const saveLocalTasks = (tasks) => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(tasks));
    } catch (error) {
      console.error("Error saving to localStorage:", error);
    }
  };

  const todoTasks = filteredTodos.filter((t) => t.status === "todo");
  const progressTasks = filteredTodos.filter((t) => t.status === "progress");
  const completedTasks = filteredTodos.filter((t) => t.status === "completed");

  const addTask = async (status = "todo") => {
    if (token && isAuthenticated) {
      try {
        const res = await fetch(`${API_URL}/tasks`, {
          method: "POST",
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            status,
            text: "",
            colorClass,
          }),
        });

        if (!res.ok) {
          throw new Error(`Error: ${res.status}`);
        }

        const resTask = await res.json();
        const newTask = _.mapKeys(resTask, (value, key) => _.camelCase(key));
        console.log("Task created:", newTask);

        setTodos((prev) => [...prev, newTask]);
      } catch (error) {
        console.error("Error creating task:", error);
      }
    } else {
      try {
        const newTask = {
          id: Date.now().toString(),
          status,
          text: "",
          createdAt: new Date().toISOString(),
          colorClass,
        };

        console.log("Task created locally:", newTask);

        const existingTasks = getLocalTasks();
        const updatedTasks = [...existingTasks, newTask];

        saveLocalTasks(updatedTasks);
        setTodos((prev) => [...prev, newTask]);
      } catch (error) {
        console.error("Error creating local task:", error);
      }
    }
  };

  // Eliminar tarea
  const deleteTask = async (taskId) => {
    if (token && isAuthenticated) {
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

        setTodos((prev) => prev.filter((task) => task.id !== taskId));
      } catch (error) {
        console.error("Error deleting task:", error);
      }
    } else {
      try {
        const tasks = getLocalTasks();
        const updatedTasks = tasks.filter((task) => task.id !== taskId);

        saveLocalTasks(updatedTasks);
        setTodos((prev) => prev.filter((task) => task.id !== taskId));
      } catch (error) {
        console.error("Error deleting local task:", error);
      }
    }
  };

  // Editar tarea
  const handleEdit = async (id, newText) => {
    try {
      const task = todos.find((t) => t.id === id);
      if (!task) return;

      if (token && isAuthenticated) {
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
          const errText = await res.text();
          throw new Error(`Error updating task: ${res.status} - ${errText}`);
        }

        const resTask = await res.json();
        const newTask = _.mapKeys(resTask, (value, key) => _.camelCase(key));

        setTodos((prev) => prev.map((t) => (t.id === id ? newTask : t)));
        console.log("✅ Task updated in API:", newTask);
      } else {
        const updatedTask = { ...task, text: newText };

        const localTasks = getLocalTasks();
        const updatedTasks = localTasks.map((t) =>
          t.id === id ? updatedTask : t
        );
        saveLocalTasks(updatedTasks);

        setTodos((prev) => prev.map((t) => (t.id === id ? updatedTask : t)));
        console.log("✅ Task updated in localStorage:", updatedTask);
      }
    } catch (err) {
      console.error("❌ Error editing task:", err);
    }
  };

  const handleStatusChange = async (taskId, newStatus, position = null) => {
    try {
      const task = todos.find((t) => t.id === taskId);
      if (!task) {
        console.error("Task not found:", taskId);
        return;
      }

      if (token && isAuthenticated) {
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

        const resTask = await res.json();
        const updatedTask = _.mapKeys(resTask, (value, key) =>
          _.camelCase(key)
        );

        setTodos((prev) => {
          // Remover la tarea de su posición actual
          const filtered = prev.filter((t) => t.id !== taskId);

          // Si position es 0, insertar al inicio; si no, agregar al final
          if (position === 0) {
            return [updatedTask, ...filtered];
          }
          return [...filtered, updatedTask];
        });
        console.log("✅ Task moved in API:", updatedTask);
      } else {
        const updatedTask = { ...task, status: newStatus };
        const localTasks = getLocalTasks();

        const filtered = localTasks.filter((t) => t.id !== taskId);

        let updatedTasks;
        if (position === 0) {
          updatedTasks = [updatedTask, ...filtered];
        } else {
          updatedTasks = [...filtered, updatedTask];
        }

        saveLocalTasks(updatedTasks);
        setTodos((prev) => updatedTasks);
        console.log("✅ Task moved in localStorage:", updatedTask);
      }
    } catch (err) {
      console.error("❌ Error moving task:", err);
    }
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
