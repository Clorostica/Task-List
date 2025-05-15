import React from 'react';
import { useAuth0 } from '@auth0/auth0-react';
import Header from './components/Header';
import TodoList from './components/TodoList';

export default function App() {
  const { isAuthenticated, isLoading } = useAuth0();

  if (isLoading) {
    return <div className="text-center mt-12">Loading...</div>;
  }

  return (
    <div className="relative min-h-screen bg-gray-100 flex flex-col">
      <Header isAuthenticated={isAuthenticated} />

      <div className="container mx-auto mt-12 px-4 w-full max-w-4xl flex-grow pb-12">
        <div className="bg-white rounded-3xl shadow-2xl overflow-hidden">
          <TodoList isAuthenticated={isAuthenticated} />
        </div>
      </div>
    </div>
  );
}
