import { motion, AnimatePresence } from 'framer-motion';
import React, { useState, useEffect } from 'react';
import TodoItem from './TodoItem';
import NewTask from './NewTask';

export default function TodoList({ isAuthenticated }) {
  const [todos, setTodos] = useState([]);
  const [taskText, setTaskText] = useState('');
  const [search, setSearch] = useState('');
  const [filter, setFilter] = useState('all');

  useEffect(() => {
    if (isAuthenticated) {
      const stored = localStorage.getItem('todos');
      if (stored) setTodos(JSON.parse(stored));
    } else {
      setTodos([]);
    }
  }, [isAuthenticated]);

  const addTask = () => {
    if (taskText.trim() === '') return;

    const newTodo = { id: Date.now(), text: taskText.trim(), completed: false };
    const updatedTodos = [...todos, newTodo];

    setTodos(updatedTodos);
    setTaskText('');

    if (isAuthenticated) {
      localStorage.setItem('todos', JSON.stringify(updatedTodos));
    }
  };

  const handleDelete = (id) => {
    const updated = todos.filter(todo => todo.id !== id);
    setTodos(updated);

    if (isAuthenticated) {
      localStorage.setItem('todos', JSON.stringify(updated));
    }
  };

  const handleEdit = (id) => {
    const newText = prompt('Edit task:');
    if (newText && newText.trim()) {
      const updated = todos.map(todo =>
        todo.id === id ? { ...todo, text: newText } : todo
      );
      setTodos(updated);

      if (isAuthenticated) {
        localStorage.setItem('todos', JSON.stringify(updated));
      }
    }
  };

  const filteredTodos = todos
    .filter(todo => todo.text.toLowerCase().includes(search.toLowerCase()))
    .filter(todo => {
      if (filter === 'completed') return todo.completed;
      if (filter === 'pending') return !todo.completed;
      return true;
    });

  return (
    <div className="p-8">
      <NewTask taskText={taskText} setTaskText={setTaskText} addTask={addTask} />

      {/* Filter buttons */}
      <div className="flex justify-center gap-2 mt-6 mb-4">
        <button
          onClick={() => setFilter('all')}
          className={`px-4 py-2 rounded-lg border ${
            filter === 'all' ? 'bg-blue-500 text-white' : 'bg-white text-gray-700'
          } transition`}
        >
          All
        </button>
        <button
          onClick={() => setFilter('completed')}
          className={`px-4 py-2 rounded-lg border ${
            filter === 'completed' ? 'bg-green-500 text-white' : 'bg-white text-gray-700'
          } transition`}
        >
          Completed
        </button>
        <button
          onClick={() => setFilter('pending')}
          className={`px-4 py-2 rounded-lg border ${
            filter === 'pending' ? 'bg-yellow-500 text-white' : 'bg-white text-gray-700'
          } transition`}
        >
          Pending
        </button>
      </div>

      {/* Search input */}
      <input
        type="text"
        value={search}
        onChange={(e) => setSearch(e.target.value)}
        placeholder="Search tasks..."
        className="w-full mb-6 border px-4 py-2 rounded-xl"
      />

      {/* Task list with animation */}
      <ul className="space-y-2">
        <AnimatePresence>
          {filteredTodos.map(todo => (
            <motion.li
              key={todo.id}
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, x: -100 }}
              transition={{ duration: 0.3 }}
            >
              <TodoItem
                text={todo.text}
                onDelete={() => handleDelete(todo.id)}
                onEdit={() => handleEdit(todo.id)}
              />
            </motion.li>
          ))}
        </AnimatePresence>
      </ul>
    </div>
  );
}
