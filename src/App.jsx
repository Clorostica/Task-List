import React from "react";
import { useAuth0 } from "@auth0/auth0-react";
import Header from "./components/Header";
import TodoList from "./components/TodoList";

export default function App() {
  const { isAuthenticated, isLoading } = useAuth0();

  if (isLoading) {
    return <div className="text-center mt-12">Loading...</div>;
  }

  return (
    <div className="p-4 bg-gradient-to-br from-orange-100 via-yellow-50 to-amber-100 min-h-screen">
      <Header isAuthenticated={isAuthenticated} />

      <div className="max-w-full mx-auto">
        <h1
          className="text-4xl font-bold text-gray-800 mb-6 text-center drop-shadow-lg"
          style={{ fontFamily: "Comic Sans MS, cursive" }}
        >
          🖇️ My Sticky Note Board
        </h1>

        <TodoList isAuthenticated={isAuthenticated} />
      </div>
    </div>
  );
}
