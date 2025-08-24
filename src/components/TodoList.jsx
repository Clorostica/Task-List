import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import SearchBar from "./Search";

// useDrag Hook
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

// Sticky Colors
const stickyColors = [
  "bg-yellow-200 border-yellow-300",
  "bg-pink-200 border-pink-300",
  "bg-blue-200 border-blue-300",
  "bg-green-200 border-green-300",
  "bg-purple-200 border-purple-300",
  "bg-orange-200 border-orange-300",
];

// TodoItem Component
function TodoItem({ id, text, status, onDelete, onEdit, onStatusChange }) {
  const colorClass = stickyColors[id % stickyColors.length];
  const { isDragging, handleDragStart, handleDragEnd } = useDrag({
    id,
    text,
    status,
  });

  return (
    <motion.div
      layout
      initial={{ opacity: 0, scale: 0.8, rotate: -5 }}
      animate={{ opacity: 1, scale: 1, rotate: Math.random() * 6 - 3 }}
      exit={{ opacity: 0, scale: 0.8, rotate: -15 }}
      whileHover={{ scale: 1.05, rotate: 0, zIndex: 10 }}
      className={`${colorClass} p-4 rounded-lg shadow-lg border-l-4 transition-all duration-200 cursor-grab group relative ${
        isDragging ? "opacity-50 z-50" : ""
      }`}
      style={{ fontFamily: "Comic Sans MS, cursive" }}
      draggable
      onDragStart={handleDragStart}
      onDragEnd={handleDragEnd}
    >
      {/* Tape effect */}
      <div className="absolute -top-2 left-1/4 w-12 h-6 bg-white bg-opacity-70 rotate-12 shadow-sm"></div>

      <div className="flex justify-between items-start mb-3">
        <p className="text-gray-800 flex-1 pr-2 font-medium leading-relaxed">
          {text}
        </p>
        <div className="flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
          <button
            onClick={onEdit}
            className="text-blue-600 hover:text-blue-800 text-sm px-2 py-1 rounded bg-white bg-opacity-50 hover:bg-opacity-80"
          >
            ✏️
          </button>
          <button
            onClick={onDelete}
            className="text-red-600 hover:text-red-800 text-sm px-2 py-1 rounded bg-white bg-opacity-50 hover:bg-opacity-80"
          >
            🗑️
          </button>
        </div>
      </div>

      {/* Status buttons */}
      <div className="flex flex-wrap gap-1">
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
            Complete ✓
          </button>
        )}
      </div>
    </motion.div>
  );
}

// NewTask Component
function NewTask({ taskText, setTaskText, addTask }) {
  return (
    <div className="mb-6 bg-white p-6 rounded-xl shadow-sm border">
      <h2 className="text-xl font-semibold mb-4 text-gray-800">Add New Task</h2>
      <div className="flex gap-3">
        <input
          type="text"
          value={taskText}
          onChange={(e) => setTaskText(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && addTask()}
          placeholder="What needs to be done?"
          className="flex-1 border border-gray-300 px-4 py-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
        />
        <button
          onClick={addTask}
          className="px-6 py-3 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors font-medium"
        >
          Add Task
        </button>
      </div>
    </div>
  );
}

// Column Component
function Column({
  title,
  tasks,
  onDelete,
  onEdit,
  onStatusChange,
  bgColor,
  textColor,
  columnStatus,
}) {
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
        <span className="bg-white bg-opacity-30 px-3 py-1 rounded-full text-base font-semibold">
          {tasks.length}
        </span>
      </div>
      <div
        className={`bg-gradient-to-br from-amber-50 to-yellow-50 p-6 rounded-b-xl min-h-[550px] relative border-4 transition-all duration-200 ${
          isOver ? "border-blue-400 bg-blue-50 scale-102" : "border-amber-200"
        }`}
        style={{
          backgroundImage: `
            radial-gradient(circle at 25% 25%, #d4c5a9 2px, transparent 2px),
            radial-gradient(circle at 75% 25%, #d4c5a9 2px, transparent 2px),
            radial-gradient(circle at 25% 75%, #d4c5a9 2px, transparent 2px),
            radial-gradient(circle at 75% 75%, #d4c5a9 2px, transparent 2px)
          `,
          backgroundSize: "50px 50px",
        }}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
      >
        <div className="space-y-4 relative z-10">
          <AnimatePresence>
            {tasks.map((task) => (
              <motion.div
                key={task.id}
                initial={{
                  opacity: 0,
                  y: -20,
                  rotate: Math.random() * 20 - 10,
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
                  onEdit={() => onEdit(task.id)}
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

// Main TodoList Component
export default function TodoList({ isAuthenticated = true }) {
  const [todos, setTodos] = useState([]);
  const [taskText, setTaskText] = useState("");
  const [search, setSearch] = useState("");

  useEffect(() => {
    if (isAuthenticated) {
      const sampleData = [
        { id: 1, text: "Review project proposal", status: "todo" },
        { id: 2, text: "Design new landing page", status: "progress" },
        { id: 3, text: "Set up development environment", status: "completed" },
      ];
      setTodos(sampleData);
    } else {
      setTodos([]);
    }
  }, [isAuthenticated]);

  const addTask = () => {
    if (!taskText.trim()) return;
    setTodos([
      ...todos,
      { id: Date.now(), text: taskText.trim(), status: "todo" },
    ]);
    setTaskText("");
  };

  const handleDelete = (id) => setTodos(todos.filter((t) => t.id !== id));
  const handleEdit = (id) => {
    const newText = prompt("Edit task:");
    if (newText && newText.trim())
      setTodos(
        todos.map((t) => (t.id === id ? { ...t, text: newText.trim() } : t))
      );
  };
  const handleStatusChange = (id, newStatus) =>
    setTodos(todos.map((t) => (t.id === id ? { ...t, status: newStatus } : t)));

  // Filtered tasks
  const filteredTodos = todos.filter((t) =>
    t.text.toLowerCase().includes(search.toLowerCase())
  );
  const todoTasks = filteredTodos.filter((t) => t.status === "todo");
  const progressTasks = filteredTodos.filter((t) => t.status === "progress");
  const completedTasks = filteredTodos.filter((t) => t.status === "completed");

  return (
    <div>
      <div>
        <NewTask
          taskText={taskText}
          setTaskText={setTaskText}
          addTask={addTask}
        />
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
    </div>
  );
}
