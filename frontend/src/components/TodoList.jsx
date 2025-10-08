import React, { useState, useEffect } from "react";
import SearchBar from "./Search";
import { useAuth0 } from "@auth0/auth0-react";
import Column from "./Column";

const API_URL = "http://localhost:3000";

export default function TodoList() {
  const [token, setToken] = useState();
  const [todos, setTodos] = useState([]);
  const [search, setSearch] = useState("");
  const {
    getIdTokenClaims,
    user: authUser,
    isAuthenticated: authIsAuthenticated,
  } = useAuth0();
  const STORAGE_KEY = "nouser_tasks";

  // to get the task from localStorage
  const getLocalTasks = () => {
    try {
      const tasks = localStorage.getItem(STORAGE_KEY);
      return tasks ? JSON.parse(tasks) : [];
    } catch (error) {
      console.error("Error reading from localStorage:", error);
      return [];
    }
  };

  // to save the task from localStorage
  const saveLocalTasks = (tasks) => {
    try {
      console.log("saveLocalTasksx");
      console.log(tasks);
      console.log(JSON.stringify(tasks));
      localStorage.setItem(STORAGE_KEY, JSON.stringify(tasks));
    } catch (error) {
      console.error("Error saving to localStorage:", error);
    }
  };

  useEffect(() => {
    const loadTasks = async () => {
      try {
        const token = await getIdTokenClaims();

        if (token) {
          const idToken = token.__raw;
          setToken(idToken);

          const res = await fetch(`${API_URL}/tasks`, {
            headers: {
              Authorization: `Bearer ${idToken}`,
            },
          });

          if (!res.ok) throw new Error("Error loading tasks");

          const data = await res.json();
          setTodos(data.tasks);
          console.log("✅ Tasks loaded from API:", data.tasks);
        } else {
          setToken(null);
          const localTasks = getLocalTasks();
          setTodos(localTasks);
          console.log("✅ Tasks loaded from localStorage:", localTasks);
        }
      } catch (err) {
        console.error("❌ Error loading tasks:", err);
      }
    };

    loadTasks();
  }, [token]);

  // new task in the backend
  const addTask = async (status = "todo") => {
    if (token) {
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
          }),
        });

        if (!res.ok) {
          throw new Error(`Error: ${res.status}`);
        }

        const newTask = await res.json();
        console.log("Task created:", newTask);

        setTodos((prev) => [...prev, newTask]);
      } catch (error) {
        console.error("Error creating task:", error);
      }
    } else {
      // new task in localstorage
      try {
        const newTask = {
          id: Date.now().toString(),
          status,
          text: "",
          createdAt: new Date().toISOString(),
        };

        console.log("Task created locally:", newTask);

        const existingTasks = getLocalTasks();

        const updatedTasks = [...existingTasks, newTask];

        console.log("updatedTasks");
        console.log(updatedTasks);

        saveLocalTasks(updatedTasks);

        setTodos((prev) => [...prev, newTask]);
      } catch (error) {
        console.error("Error creating local task:", error);
      }
    }
  };

  // Delete task
  const deleteTask = async (taskId) => {
    if (token) {
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
  // Editar task
  const handleEdit = async (id, newText) => {
    try {
      const task = todos.find((t) => t.id === id);
      if (!task) return;
      if (token) {
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

        const updatedTask = await res.json();
        setTodos((prev) => prev.map((t) => (t.id === id ? updatedTask : t)));
        console.log("✅ Task updated in API:", updatedTask);
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

  const handleStatusChange = async (id, newStatus) => {
    try {
      const task = todos.find((t) => t.id === id);
      if (!task) return;

      if (token) {
        const res = await fetch(`${API_URL}/tasks/${id}`, {
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

        if (!res.ok) throw new Error("Error updating status");
        const updatedTask = await res.json();

        setTodos((prev) => prev.map((t) => (t.id === id ? updatedTask : t)));
        console.log("✅ Status updated in API:", updatedTask);
      } else {
        const updatedTask = { ...task, status: newStatus };
        const localTasks = getLocalTasks();
        const updatedTasks = localTasks.map((t) =>
          t.id === id ? updatedTask : t
        );
        saveLocalTasks(updatedTasks);

        setTodos((prev) => prev.map((t) => (t.id === id ? updatedTask : t)));
        console.log("✅ Status updated in localStorage:", updatedTask);
      }
    } catch (err) {
      console.error("❌ Error updating status:", err);
    }
  };

  const filteredTodos = todos.filter((t) =>
    (t.text || "").toLowerCase().includes((search || "").toLowerCase())
  );

  const todoTasks = filteredTodos.filter((t) => t.status === "todo");
  const progressTasks = filteredTodos.filter((t) => t.status === "progress");
  const completedTasks = filteredTodos.filter((t) => t.status === "completed");

  return (
    <div>
      <SearchBar search={search} setSearch={setSearch} />

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
    </div>
  );
}
