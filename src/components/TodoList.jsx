import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import SearchBar from "./Search";

const stickyColors = [
  "bg-yellow-200 border-yellow-300",
  "bg-pink-200 border-pink-300",
  "bg-blue-200 border-blue-300",
  "bg-green-200 border-green-300",
  "bg-purple-200 border-purple-300",
  "bg-orange-200 border-orange-300",
];

// Hook para drag
const useDrag = ({ id, text, status }) => {
  const [isDragging, setIsDragging] = useState(false);

  const handleDragStart = (e) => {
    setIsDragging(true);
    e.dataTransfer.setData("text/plain", JSON.stringify({ id, text, status }));
    e.dataTransfer.effectAllowed = "move";
  };

  const handleDragEnd = () => {
    setIsDragging(false);
  };

  return { isDragging, handleDragStart, handleDragEnd };
};

// Componente TodoItem editable directamente
function TodoItem({ id, text, status, onDelete, onEdit, onStatusChange }) {
  const [editText, setEditText] = useState(text);
  const { isDragging, handleDragStart, handleDragEnd } = useDrag({
    id,
    text,
    status,
  });
  const colorClass = stickyColors[id % stickyColors.length];

  const handleBlur = () => {
    if (editText.trim() && editText !== text) {
      onEdit(id, editText.trim());
    }
  };

  const handleKeyDown = (e) => {
    if (e.key === "Enter") {
      e.preventDefault();
      if (editText.trim()) {
        onEdit(id, editText.trim());
      }
    }
  };

  return (
    <motion.div
      layout
      initial={{ opacity: 0, scale: 0.8, rotate: -5 }}
      animate={{ opacity: 1, scale: 1, rotate: Math.random() * 6 - 3 }}
      exit={{ opacity: 0, scale: 0.8, rotate: -15 }}
      whileHover={{ scale: 1.05, rotate: 0, zIndex: 10 }}
      className={`group ${colorClass} p-4 rounded-lg shadow-lg border-l-4 transition-all duration-200 cursor-grab`}
      draggable
      onDragStart={handleDragStart}
      onDragEnd={handleDragEnd}
    >
      <div className="absolute -top-2 left-1/4 w-12 h-6 bg-white bg-opacity-70 rotate-12 shadow-sm"></div>

      <textarea
        value={editText}
        onChange={(e) => setEditText(e.target.value)}
        onBlur={handleBlur}
        onKeyDown={handleKeyDown}
        placeholder="Write your task..."
        className="w-full bg-transparent resize-none focus:outline-none text-gray-800 font-medium mt-4"
      />

      <div className="flex flex-wrap gap-1 mt-2 opacity-0 group-hover:opacity-100 transition-opacity duration-200">
        {status !== "todo" && (
          <button
            onClick={() => onStatusChange(id, "todo")}
            className="text-xs px-2 py-1 bg-white bg-opacity-60 hover:bg-opacity-90 rounded-full text-gray-700 font-medium"
          >
            ← To Do
          </button>
        )}
        {status !== "progress" && (
          <button
            onClick={() => onStatusChange(id, "progress")}
            className="text-xs px-2 py-1 bg-white bg-opacity-60 hover:bg-opacity-90 rounded-full text-gray-700 font-medium"
          >
            {status === "todo" ? "Start →" : "← In Progress"}
          </button>
        )}
        {status !== "completed" && (
          <button
            onClick={() => onStatusChange(id, "completed")}
            className="text-xs px-2 py-1 bg-white bg-opacity-60 hover:bg-opacity-90 rounded-full text-gray-700 font-medium"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="w-5 h-5 text-green-500"
              viewBox="0 0 20 20"
              fill="currentColor"
            >
              <path
                fillRule="evenodd"
                d="M16.707 5.293a1 1 0 010 1.414l-7.5 7.5a1 1 0 01-1.414 0l-3.5-3.5a1 1 0 111.414-1.414L9 12.586l6.793-6.793a1 1 0 011.414 0z"
                clipRule="evenodd"
              />
            </svg>
          </button>
        )}
        <button
          onClick={onDelete}
          className="p-2 bg-red-500 hover:bg-red-600 rounded-full flex items-center justify-center"
          title="Delete task"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="w-5 h-5 text-white"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
            strokeWidth={2}
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6M1 7h22M10 7V4a1 1 0 011-1h2a1 1 0 011 1v3"
            />
          </svg>
        </button>
      </div>
    </motion.div>
  );
}

function Column({
  title,
  tasks,
  onDelete,
  onEdit,
  onStatusChange,
  bgColor,
  textColor,
  columnStatus,
  addTask,
}) {
  const [columnTasks, setColumnTasks] = useState(tasks);
  useEffect(() => {
    setColumnTasks(tasks);
  }, [tasks]);

  const moveTask = (draggedId, hoverId) => {
    const draggedIndex = columnTasks.findIndex((t) => t.id === draggedId);
    const hoverIndex = columnTasks.findIndex((t) => t.id === hoverId);
    const updatedTasks = [...columnTasks];
    const [removed] = updatedTasks.splice(draggedIndex, 1);
    updatedTasks.splice(hoverIndex, 0, removed);
    setColumnTasks(updatedTasks);
  };
  const [isOver, setIsOver] = useState(false);

  const handleDragOver = (e) => {
    e.preventDefault();
    e.dataTransfer.dropEffect = "move";
    setIsOver(true);
  };

  const handleDragLeave = () => setIsOver(false);

  const handleDrop = (e) => {
    e.preventDefault();
    setIsOver(false);
    try {
      const taskData = JSON.parse(e.dataTransfer.getData("text/plain"));
      if (taskData.status !== columnStatus)
        onStatusChange(taskData.id, columnStatus);
    } catch (err) {
      console.error("Error parsing dropped data:", err);
    }
  };

  return (
    <div className="flex-1 min-h-[600px] mx-2">
      <div
        className={`${bgColor} ${textColor} p-4 rounded-t-xl font-bold text-xl flex items-center justify-between shadow-lg`}
      >
        <span>{title}</span>

        <div className="flex items-center gap-3">
          <span className="bg-white bg-opacity-30 px-3 py-1 rounded-full text-base font-semibold">
            {tasks.length}
          </span>

          {columnStatus === "todo" && (
            <button
              onClick={addTask}
              className="w-8 h-8 bg-white bg-opacity-20 hover:bg-opacity-30 text-white rounded-full font-bold text-lg flex items-center justify-center transition-all duration-200 hover:scale-110"
              title="Add new task"
            >
              +
            </button>
          )}
        </div>
      </div>

      <div
        className={`bg-gradient-to-br from-amber-50 to-yellow-50 p-6 rounded-b-xl min-h-[420px] relative border-4 transition-all duration-200 ${
          isOver ? "border-blue-400 bg-blue-50 scale-102" : "border-amber-200"
        }`}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
        style={{
          backgroundImage: `
            radial-gradient(circle at 25% 25%, #d4c5a9 2px, transparent 2px),
            radial-gradient(circle at 75% 25%, #d4c5a9 2px, transparent 2px),
            radial-gradient(circle at 25% 75%, #d4c5a9 2px, transparent 2px),
            radial-gradient(circle at 75% 75%, #d4c5a9 2px, transparent 2px)
          `,
          backgroundSize: "50px 50px",
        }}
      >
        <div className="space-y-4 relative z-10">
          <AnimatePresence>
            {tasks.map((task) => (
              <motion.div
                key={task.id}
                layout
                drag="y"
                initial={{
                  opacity: 0,
                  y: -20,
                  rotate: Math.random() * 6 - 3,
                }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, x: -200, rotate: -20 }}
                style={{
                  marginLeft: `${Math.random() * 20}px`,
                  marginTop: `${Math.random() * 10}px`,
                }}
              >
                <TodoItem
                  id={task.id}
                  text={task.text}
                  status={task.status}
                  onDelete={() => onDelete(task.id)}
                  onEdit={onEdit}
                  onStatusChange={onStatusChange}
                />
              </motion.div>
            ))}
          </AnimatePresence>
        </div>

        {tasks.length === 0 && (
          <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
            <div
              className={`text-center text-lg italic font-medium px-6 py-3 rounded-lg shadow-sm transition-all duration-200 ${
                isOver
                  ? "text-blue-600 bg-blue-100 bg-opacity-90 scale-110"
                  : "text-amber-400 bg-white bg-opacity-70"
              }`}
            >
              {isOver ? "🎯 Drop here!" : "Drop your sticky notes here! 📝"}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default function TodoList({ isAuthenticated = true }) {
  const [todos, setTodos] = useState([]);
  const [search, setSearch] = useState("");

  useEffect(() => {
    if (!isAuthenticated) {
      setTodos([]);
    }
  }, [isAuthenticated]);

  const addTask = () => {
    const newTask = { id: Date.now(), text: "", status: "todo" };
    setTodos([...todos, newTask]);
  };

  const handleDelete = (id) => setTodos(todos.filter((t) => t.id !== id));
  const handleEdit = (id, newText) =>
    setTodos(todos.map((t) => (t.id === id ? { ...t, text: newText } : t)));
  const handleStatusChange = (id, newStatus) =>
    setTodos(todos.map((t) => (t.id === id ? { ...t, status: newStatus } : t)));

  const filteredTodos = todos.filter((t) =>
    t.text.toLowerCase().includes(search.toLowerCase())
  );
  const todoTasks = filteredTodos.filter((t) => t.status === "todo");
  const progressTasks = filteredTodos.filter((t) => t.status === "progress");
  const completedTasks = filteredTodos.filter((t) => t.status === "completed");

  return (
    <div>
      <SearchBar search={search} setSearch={setSearch} />

      <div className="flex gap-0 overflow-x-auto pb-4">
        <Column
          title="📝 To Do"
          tasks={todoTasks}
          onDelete={handleDelete}
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
          onDelete={handleDelete}
          onEdit={handleEdit}
          onStatusChange={handleStatusChange}
          bgColor="bg-gradient-to-r from-yellow-500 to-yellow-600"
          textColor="text-white"
          columnStatus="progress"
        />
        <Column
          title="✅ Completed"
          tasks={completedTasks}
          onDelete={handleDelete}
          onEdit={handleEdit}
          onStatusChange={handleStatusChange}
          bgColor="bg-gradient-to-r from-green-500 to-green-600"
          textColor="text-white"
          columnStatus="completed"
        />
      </div>
    </div>
  );
}
