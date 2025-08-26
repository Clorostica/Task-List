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

function TodoItem({ id, text, status, onDelete, onEdit, onStatusChange }) {
  const [editText, setEditText] = useState(text);
  const [isHovered, setIsHovered] = useState(false);
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
      animate={{
        opacity: 1,
        scale: isHovered ? 1.08 : 1,
        rotate: isHovered ? 0 : Math.random() * 6 - 3,
        y: isHovered ? -8 : 0,
      }}
      exit={{ opacity: 0, scale: 0.8, rotate: -15 }}
      whileHover={{
        scale: 1.08,
        rotate: 0,
        zIndex: 10,
        y: -8,
        boxShadow: "0 20px 40px rgba(0,0,0,0.15)",
      }}
      whileTap={{ scale: 0.98 }}
      transition={{
        type: "spring",
        stiffness: 300,
        damping: 20,
        duration: 0.3,
      }}
      className={`group ${colorClass} p-4 rounded-lg shadow-lg border-l-4 transition-all duration-300 cursor-grab relative overflow-hidden`}
      draggable
      onDragStart={handleDragStart}
      onDragEnd={handleDragEnd}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <motion.div
        className="absolute -top-2 left-1/4 w-12 h-6 bg-white bg-opacity-70 rotate-12 shadow-sm"
        animate={{
          rotate: isHovered ? 8 : 12,
          scale: isHovered ? 1.1 : 1,
        }}
        transition={{ duration: 0.2 }}
      />

      <motion.div
        className="absolute inset-0 bg-white rounded-lg"
        initial={{ opacity: 0 }}
        animate={{ opacity: isHovered ? 0.1 : 0 }}
        transition={{ duration: 0.2 }}
      />

      <textarea
        value={editText}
        onChange={(e) => setEditText(e.target.value)}
        onBlur={handleBlur}
        onKeyDown={handleKeyDown}
        placeholder="Write your task..."
        className="w-full bg-transparent resize-none focus:outline-none text-gray-800 font-medium mt-4 relative z-10"
      />

      <motion.div
        className="absolute top-2 right-2 flex gap-2 z-20"
        initial={{ opacity: 0, scale: 0.8, y: -10 }}
        animate={{
          opacity: isHovered ? 1 : 0,
          scale: isHovered ? 1 : 0.8,
          y: isHovered ? 0 : -10,
        }}
        transition={{ duration: 0.2, delay: isHovered ? 0.1 : 0 }}
      >
        {status !== "todo" && (
          <motion.button
            onClick={() => onStatusChange(id, "todo")}
            whileHover={{ scale: 1.1, rotate: -2 }}
            whileTap={{ scale: 0.95 }}
            className="group/btn relative px-2 py-1 bg-gradient-to-r from-blue-400 to-blue-500 hover:from-blue-500 hover:to-blue-600 rounded-full text-white text-xs font-medium shadow-lg transition-all duration-200"
          >
            <span className="relative z-10 flex items-center gap-1">
              <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 20 20">
                <path
                  fillRule="evenodd"
                  d="M12.707 5.293a1 1 0 010 1.414L9.414 10l3.293 3.293a1 1 0 01-1.414 1.414l-4-4a1 1 0 010-1.414l4-4a1 1 0 011.414 0z"
                  clipRule="evenodd"
                />
              </svg>
              To Do
            </span>
            <div className="absolute inset-0 bg-white opacity-0 group-hover/btn:opacity-20 rounded-full transition-opacity duration-200" />
          </motion.button>
        )}

        {status !== "progress" && (
          <motion.button
            onClick={() => onStatusChange(id, "progress")}
            whileHover={{ scale: 1.1, rotate: 2 }}
            whileTap={{ scale: 0.95 }}
            className="group/btn relative px-2 py-1 bg-gradient-to-r from-yellow-400 to-orange-500 hover:from-yellow-500 hover:to-orange-600 rounded-full text-white text-xs font-medium shadow-lg transition-all duration-200"
          >
            <span className="relative z-10 flex items-center gap-1">
              {status === "todo" ? (
                <>
                  <svg
                    className="w-3 h-3"
                    fill="currentColor"
                    viewBox="0 0 20 20"
                  >
                    <path
                      fillRule="evenodd"
                      d="M10.293 3.293a1 1 0 011.414 0l6 6a1 1 0 010 1.414l-6 6a1 1 0 01-1.414-1.414L14.586 11H3a1 1 0 110-2h11.586l-4.293-4.293a1 1 0 010-1.414z"
                      clipRule="evenodd"
                    />
                  </svg>
                  Start
                </>
              ) : (
                <>
                  <svg
                    className="w-3 h-3"
                    fill="currentColor"
                    viewBox="0 0 20 20"
                  >
                    <path
                      fillRule="evenodd"
                      d="M12.707 5.293a1 1 0 010 1.414L9.414 10l3.293 3.293a1 1 0 01-1.414 1.414l-4-4a1 1 0 010-1.414l4-4a1 1 0 011.414 0z"
                      clipRule="evenodd"
                    />
                  </svg>
                  Progress
                </>
              )}
            </span>
            <div className="absolute inset-0 bg-white opacity-0 group-hover/btn:opacity-20 rounded-full transition-opacity duration-200" />
          </motion.button>
        )}

        {status !== "completed" && (
          <motion.button
            onClick={() => onStatusChange(id, "completed")}
            whileHover={{ scale: 1.1, rotate: -2 }}
            whileTap={{ scale: 0.95 }}
            className="group/btn relative w-8 h-8 bg-gradient-to-r from-green-400 to-green-500 hover:from-green-500 hover:to-green-600 rounded-full text-white shadow-lg flex items-center justify-center transition-all duration-200"
          >
            <svg
              className="w-4 h-4 relative z-10"
              fill="currentColor"
              viewBox="0 0 20 20"
            >
              <path
                fillRule="evenodd"
                d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                clipRule="evenodd"
              />
            </svg>
            <div className="absolute inset-0 bg-white opacity-0 group-hover/btn:opacity-20 rounded-full transition-opacity duration-200" />
          </motion.button>
        )}

        <motion.button
          onClick={onDelete}
          whileHover={{ scale: 1.1, rotate: 3 }}
          whileTap={{ scale: 0.95 }}
          className="group/btn relative w-8 h-8 bg-gradient-to-r from-red-400 to-red-500 hover:from-red-500 hover:to-red-600 rounded-full text-white shadow-lg flex items-center justify-center transition-all duration-200"
          title="Delete task"
        >
          <svg
            className="w-4 h-4 relative z-10"
            fill="currentColor"
            viewBox="0 0 20 20"
          >
            <path
              fillRule="evenodd"
              d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z"
              clipRule="evenodd"
            />
          </svg>
          <div className="absolute inset-0 bg-white opacity-0 group-hover/btn:opacity-20 rounded-full transition-opacity duration-200" />
        </motion.button>
      </motion.div>

      <motion.div
        className="absolute bottom-0 right-0 w-6 h-6 bg-gray-300 bg-opacity-30"
        style={{
          clipPath: "polygon(100% 0, 0 100%, 100% 100%)",
        }}
        animate={{
          scale: isHovered ? 1.2 : 1,
          opacity: isHovered ? 0.4 : 0.2,
        }}
        transition={{ duration: 0.2 }}
      />
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

          <motion.button
            onClick={() => addTask(columnStatus)}
            whileHover={{ scale: 1.1, rotate: 90 }}
            whileTap={{ scale: 0.9 }}
            className="w-8 h-8 bg-white bg-opacity-20 hover:bg-opacity-30 text-white rounded-full font-bold text-lg flex items-center justify-center transition-all duration-200 group"
            title={`Add new task to ${title}`}
          >
            <span className="group-hover:rotate-90 transition-transform duration-200">
              +
            </span>
          </motion.button>
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
            <motion.div
              className={`text-center text-lg italic font-medium px-6 py-3 rounded-lg shadow-sm transition-all duration-200 ${
                isOver
                  ? "text-blue-600 bg-blue-100 bg-opacity-90 scale-110"
                  : "text-amber-400 bg-white bg-opacity-70"
              }`}
              animate={{
                scale: isOver ? 1.1 : 1,
                rotate: isOver ? 2 : 0,
              }}
            >
              {isOver ? "🎯 Drop here!" : "Drop your sticky notes here! 📝"}
            </motion.div>
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

  const addTask = (status = "todo") => {
    const newTask = { id: Date.now(), text: "", status };
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
          addTask={addTask}
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
          addTask={addTask}
        />
      </div>
    </div>
  );
}
