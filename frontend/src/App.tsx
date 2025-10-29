import React from "react";
import { useAuth0 } from "@auth0/auth0-react";
import { useEffect, useState } from "react";
import { getTasks } from "./utils/storage";
import type { Task } from "./types/tasks/task.types";
import Header from "./components/Header";
import TodoList from "./components/TodoList";
import Search from "./components/Search"; 

export default function App() {
  const { user, getIdTokenClaims, isAuthenticated, isLoading } = useAuth0();

  const [search, setSearch] = useState<string>("");
  const [token, setToken] = useState<string | null>(null);
  const [todos, setTodos] = useState<Task[]>([]);

  const API_URL = import.meta.env.VITE_API as string;

  const createUser = async () => {
    try {
      const tokenClaims = await getIdTokenClaims();
      if (!tokenClaims) {
        return;
      }
      const idToken = tokenClaims.__raw;
      setToken(idToken);

      const checkRes = await fetch(`${API_URL}/users`, {
        headers: { Authorization: `Bearer ${idToken}` },
      });
      const existingUsers = await checkRes.json();

      if (existingUsers.email) {
        console.log("✅ The user already exists:", existingUsers.email);
        return;
      }

      const res = await fetch(`${API_URL}/users`, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${idToken}`,
        },
      });

      if (!res.ok) throw new Error("Error creating user");

      const newUser = await res.json();
      console.log("🆕 user created", newUser);
    } catch (err) {
      console.error("❌ Error creating/verifying user", err);
    }
  };

  useEffect(() => {
    const loadTasks = async () => {
      try {
        if (isAuthenticated && user) {
          const tokenClaims = await getIdTokenClaims();
          if (tokenClaims) {
            const idToken = tokenClaims.__raw;
            setToken(idToken);

            const res = await fetch(`${API_URL}/tasks`, {
              headers: {
                Authorization: `Bearer ${idToken}`,
              },
            });

            if (!res.ok) throw new Error("Error loading tasks");

            const data = await res.json();
            const tasks = data.tasks.map((task: Task) =>
              Object.fromEntries(
                Object.entries(task).map(([key, value]) => [
                  key.replace(/_([a-z])/g, (g: any) => g[1].toUpperCase()),
                  value,
                ])
              )
            );

            setTodos(tasks);
            console.log("✅ Tasks loaded from API:", tasks);
          }
        } else if (!isLoading) {
          setToken(null);
          const localTasks = getTasks();
          setTodos(localTasks);
          console.log("✅ Tasks loaded from localStorage:", localTasks);
        }
      } catch (err) {
        console.error("❌ Error loading tasks:", err);
      }
    };

    loadTasks();
  }, [isAuthenticated, isLoading, user, getIdTokenClaims]);

  useEffect(() => {
    if (!isLoading && isAuthenticated && user) {
      createUser();
    }
    console.log(user);
  }, [isAuthenticated, isLoading, user, getIdTokenClaims]);

  if (isLoading) {
    return <div className="text-center mt-12">Loading...</div>;
  }

  return (
    <div className="p-2 sm:p-4 bg-gradient-to-br from-orange-100 via-yellow-50 to-amber-100 min-h-screen">
      <div className="flex flex-col sm:flex-row justify-between items-center gap-4 px-4 sm:px-6 py-6 sm:py-8">
        <h1
          className="text-xl sm:text-2xl lg:text-3xl font-bold text-gray-800 drop-shadow-md flex-1 text-center sm:text-left"
          style={{ fontFamily: "Comic Sans MS, cursive" }}
        >
          🖇️ Sticky Note Board
        </h1>
        <div className="w-full sm:flex-1 sm:px-4">
          <Search search={search} setSearch={setSearch} />
        </div>
        <div className="w-full sm:w-auto sm:flex-1 flex justify-center sm:justify-end">
          <Header />
        </div>
      </div>

      <div className="max-w-full mx-auto px-2 sm:px-4">
        <TodoList
          isAuthenticated={isAuthenticated}
          todos={todos}
          setTodos={setTodos}
          search={search}
          token={token}
        />
      </div>
    </div>
  );
}
