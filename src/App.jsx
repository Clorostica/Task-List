import React from "react";
import { useAuth0 } from "@auth0/auth0-react";
import Header from "./components/Header";
import TodoList from "./components/TodoList";

export default function App() {
  console.log(import.meta.env.VITE_AUTH0_CLIENT_ID);
  const { isAuthenticated, isLoading, user, loginWithRedirect } = useAuth0();

  if (isLoading) {
    return <div className="text-center mt-12">Loading...</div>;
  }

  return (
    <div className="p-4 bg-gradient-to-br from-orange-100 via-yellow-50 to-amber-100 min-h-screen">
      {/* Header y Título en la misma línea */}
      <div className="flex items-center justify-between mb-6">
        {/* Espaciador izquierdo para equilibrar */}
        <div className="w-[200px]"></div>

        <h1
          className="text-4xl font-bold text-gray-800 text-center drop-shadow-lg"
          style={{ fontFamily: "Comic Sans MS, cursive" }}
        >
          🖇️ My Sticky Note Board
        </h1>

        <Header isAuthenticated={isAuthenticated} />
      </div>

      <div className="max-w-full mx-auto">
        <TodoList isAuthenticated={isAuthenticated} />
      </div>
    </div>
  );
}
