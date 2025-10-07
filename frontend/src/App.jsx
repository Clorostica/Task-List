import React from "react";
import { useAuth0 } from "@auth0/auth0-react";
import { useEffect } from "react";
import Header from "./components/Header";
import TodoList from "./components/TodoList";

export default function App() {
  const { user, getIdTokenClaims, isAuthenticated, isLoading } = useAuth0();

  const API_URL = "http://localhost:3000";

  const createUser = async () => {
    try {
      const token = await getIdTokenClaims();
      if (!token) {
        return;
      }
      const idToken = token.__raw;

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

      if (!res.ok) throw new Error("Error creating/");

      const newUser = await res.json();
      console.log("🆕 user created", newUser);
    } catch (err) {
      console.error("❌ Error creating/verifying user", err);
    }
  };
  useEffect(() => {
    if (!isLoading && isAuthenticated && user) {
      createUser();
    }
    console.log(user);
  }, [isAuthenticated, isLoading, user]);

  if (isLoading) {
    return <div className="text-center mt-12">Loading...</div>;
  }
  return (
    <div className="p-2 sm:p-4 bg-gradient-to-br from-orange-100 via-yellow-50 to-amber-100 min-h-screen">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-4 sm:mb-6 space-y-4 sm:space-y-0">
        <div className="hidden sm:block w-[200px]"></div>

        <h1
          className="text-2xl sm:text-4xl font-bold text-gray-800 text-center drop-shadow-lg px-2"
          style={{ fontFamily: "Comic Sans MS, cursive" }}
        >
          🖇️ My Sticky Note Board
        </h1>

        <div className="flex justify-center sm:justify-end">
          <Header isAuthenticated={isAuthenticated} />
        </div>
      </div>

      <div className="max-w-full mx-auto px-1 sm:px-0">
        <TodoList isAuthenticated={isAuthenticated} user={user} />
      </div>
    </div>
  );
}
