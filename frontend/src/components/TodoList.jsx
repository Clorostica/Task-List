import React, { useState, useEffect } from "react";
import SearchBar from "./Search";
import PropTypes from "prop-types";
import { motion, AnimatePresence } from "framer-motion";
import { useAuth0 } from "@auth0/auth0-react";

const API_URL = "http://localhost:3000";

const stickyColors = [
  "bg-yellow-200 border-yellow-300",
  "bg-pink-200 border-pink-300",
  "bg-blue-200 border-blue-300",
  "bg-green-200 border-green-300",
  "bg-purple-200 border-purple-300",
  "bg-orange-200 border-orange-300",
];

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
  const [editText, setEditText] = useState(text || "");
  const [isHovered, setIsHovered] = useState(false);
  const { handleDragStart, handleDragEnd } = useDrag({ id, text, status });
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
      className={`group ${colorClass} p-3 sm:p-4 rounded-lg shadow-lg border-l-4 transition-all duration-300 cursor-grab relative overflow-hidden`}
      draggable
      onDragStart={handleDragStart}
      onDragEnd={handleDragEnd}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <motion.div
        className="absolute -top-2 left-1/4 w-8 sm:w-12 h-4 sm:h-6 bg-white bg-opacity-70 rotate-12 shadow-sm"
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
        className="w-full bg-transparent resize-none focus:outline-none text-gray-800 font-medium mt-3 sm:mt-4 relative z-10 text-sm sm:text-base"
        rows="2"
      />

      <motion.div
        className="absolute top-1 sm:top-2 right-1 sm:right-2 flex gap-1 sm:gap-2 z-20"
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
            className="group/btn relative px-1 sm:px-2 py-1 bg-gradient-to-r from-blue-400 to-blue-500 hover:from-blue-500 hover:to-blue-600 rounded-full text-white text-xs font-medium shadow-lg transition-all duration-200"
          >
            <span className="relative z-10 flex items-center gap-1">
              <svg
                className="w-2 sm:w-3 h-2 sm:h-3"
                fill="currentColor"
                viewBox="0 0 20 20"
              >
                <path
                  fillRule="evenodd"
                  d="M12.707 5.293a1 1 0 010 1.414L9.414 10l3.293 3.293a1 1 0 01-1.414 1.414l-4-4a1 1 0 010-1.414l4-4a1 1 0 011.414 0z"
                  clipRule="evenodd"
                />
              </svg>
              <span className="hidden sm:inline">To Do</span>
            </span>
          </motion.button>
        )}

        {status !== "progress" && (
          <motion.button
            onClick={() => onStatusChange(id, "progress")}
            whileHover={{ scale: 1.1, rotate: 2 }}
            whileTap={{ scale: 0.95 }}
            className="group/btn relative px-1 sm:px-2 py-1 bg-gradient-to-r from-yellow-400 to-orange-500 hover:from-yellow-500 hover:to-orange-600 rounded-full text-white text-xs font-medium shadow-lg transition-all duration-200"
          >
            <span className="relative z-10 flex items-center gap-1">
              {status === "todo" ? (
                <>
                  <svg
                    className="w-2 sm:w-3 h-2 sm:h-3"
                    fill="currentColor"
                    viewBox="0 0 20 20"
                  >
                    <path
                      fillRule="evenodd"
                      d="M10.293 3.293a1 1 0 011.414 0l6 6a1 1 0 010 1.414l-6 6a1 1 0 01-1.414-1.414L14.586 11H3a1 1 0 110-2h11.586l-4.293-4.293a1 1 0 010-1.414z"
                      clipRule="evenodd"
                    />
                  </svg>
                  <span className="hidden sm:inline">Start</span>
                </>
              ) : (
                <>
                  <svg
                    className="w-2 sm:w-3 h-2 sm:h-3"
                    fill="currentColor"
                    viewBox="0 0 20 20"
                  >
                    <path
                      fillRule="evenodd"
                      d="M12.707 5.293a1 1 0 010 1.414L9.414 10l3.293 3.293a1 1 0 01-1.414 1.414l-4-4a1 1 0 010-1.414l4-4a1 1 0 011.414 0z"
                      clipRule="evenodd"
                    />
                  </svg>
                  <span className="hidden sm:inline">Progress</span>
                </>
              )}
            </span>
          </motion.button>
        )}

        {status !== "completed" && (
          <motion.button
            onClick={() => onStatusChange(id, "completed")}
            whileHover={{ scale: 1.1, rotate: -2 }}
            whileTap={{ scale: 0.95 }}
            className="group/btn relative w-6 sm:w-8 h-6 sm:h-8 bg-gradient-to-r from-green-400 to-green-500 hover:from-green-500 hover:to-green-600 rounded-full text-white shadow-lg flex items-center justify-center transition-all duration-200"
          >
            <svg
              className="w-3 sm:w-4 h-3 sm:h-4 relative z-10"
              fill="currentColor"
              viewBox="0 0 20 20"
            >
              <path
                fillRule="evenodd"
                d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                clipRule="evenodd"
              />
            </svg>
          </motion.button>
        )}

        <motion.button
          onClick={onDelete}
          whileHover={{ scale: 1.1, rotate: 3 }}
          whileTap={{ scale: 0.95 }}
          className="group/btn relative w-6 sm:w-8 h-6 sm:h-8 bg-gradient-to-r from-red-400 to-red-500 hover:from-red-500 hover:to-red-600 rounded-full text-white shadow-lg flex items-center justify-center transition-all duration-200"
          title="Delete task"
        >
          <svg
            className="w-3 sm:w-4 h-3 sm:h-4 relative z-10"
            fill="currentColor"
            viewBox="0 0 20 20"
          >
            <path
              fillRule="evenodd"
              d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z"
              clipRule="evenodd"
            />
          </svg>
        </motion.button>
      </motion.div>

      <motion.div
        className="absolute bottom-0 right-0 w-4 sm:w-6 h-4 sm:h-6 bg-gray-300 bg-opacity-30"
        style={{ clipPath: "polygon(100% 0, 0 100%, 100% 100%)" }}
        animate={{
          scale: isHovered ? 1.2 : 1,
          opacity: isHovered ? 0.4 : 0.2,
        }}
        transition={{ duration: 0.2 }}
      />
    </motion.div>
  );
}

TodoItem.propTypes = {
  id: PropTypes.number.isRequired,
  text: PropTypes.string.isRequired,
  status: PropTypes.string.isRequired,
  onDelete: PropTypes.func.isRequired,
  onEdit: PropTypes.func.isRequired,
  onStatusChange: PropTypes.func.isRequired,
};

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
    <div className="flex-1 min-h-[400px] sm:min-h-[600px] mx-1 sm:mx-2 min-w-[280px] sm:min-w-0">
      <div
        className={`${bgColor} ${textColor} p-3 sm:p-4 rounded-t-xl font-bold text-lg sm:text-xl flex items-center justify-between shadow-lg`}
      >
        <span className="text-sm sm:text-xl">{title}</span>
        <div className="flex items-center gap-2 sm:gap-3">
          <span className="bg-white bg-opacity-30 px-2 sm:px-3 py-1 rounded-full text-sm sm:text-base font-semibold">
            {tasks.length}
          </span>
          <motion.button
            onClick={() => addTask(columnStatus)}
            whileHover={{ scale: 1.1, rotate: 90 }}
            whileTap={{ scale: 0.9 }}
            className="w-7 sm:w-8 h-7 sm:h-8 bg-white bg-opacity-20 hover:bg-opacity-30 text-white rounded-full font-bold text-base sm:text-lg flex items-center justify-center transition-all duration-200 group"
            title={`Add new task to ${title}`}
          >
            <span className="group-hover:rotate-90 transition-transform duration-200">
              +
            </span>
          </motion.button>
        </div>
      </div>

      <div
        className={`bg-gradient-to-br from-amber-50 to-yellow-50 p-3 sm:p-6 rounded-b-xl min-h-[320px] sm:min-h-[420px] relative border-4 transition-all duration-200 ${
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
          backgroundSize: "30px 30px, 30px 30px, 30px 30px, 30px 30px",
        }}
      >
        <div className="space-y-3 sm:space-y-4 relative z-10">
          <AnimatePresence initial={false}>
            {tasks.map((task) => (
              <motion.div
                key={task.id}
                layout
                initial={{ opacity: 0.2, y: 0 }}
                animate={{ opacity: 1, y: 0, transition: { duration: 0.1 } }}
                exit={{ opacity: 0, scale: 0.3 }}
                transition={{ duration: 0.1 }}
                layoutTransition={false}
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
              className={`text-center text-sm sm:text-lg italic font-medium px-4 sm:px-6 py-2 sm:py-3 rounded-lg shadow-sm transition-all duration-200 ${
                isOver
                  ? "text-blue-600 bg-blue-100 bg-opacity-90 scale-110"
                  : "text-amber-400 bg-white bg-opacity-70"
              }`}
              animate={{ scale: isOver ? 1.1 : 1, rotate: isOver ? 2 : 0 }}
            >
              {isOver ? "🎯 Drop here!" : "Drop your sticky notes here! 📝"}
            </motion.div>
          </div>
        )}
      </div>
    </div>
  );
}

Column.propTypes = {
  title: PropTypes.string.isRequired,
  tasks: PropTypes.array.isRequired,
  onDelete: PropTypes.func.isRequired,
  onEdit: PropTypes.func.isRequired,
  onStatusChange: PropTypes.func.isRequired,
  addTask: PropTypes.func.isRequired,
  bgColor: PropTypes.string,
  textColor: PropTypes.string,
  columnStatus: PropTypes.string,
};

export default function TodoList() {
  const [token, setToken] = useState();
  const [todos, setTodos] = useState([]);
  const [search, setSearch] = useState("");
  const {
    getIdTokenClaims,
    user: authUser,
    isAuthenticated: authIsAuthenticated,
  } = useAuth0();

  // Cargar tareas desde el backend al montar el componente
  useEffect(() => {
    const loadTasks = async () => {
      try {
        const token = await getIdTokenClaims();
        if (!token) return;
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
        console.log("✅ Tasks loaded:", data.tasks);
      } catch (err) {
        console.error("❌ Error loading tasks:", err);
      }
    };

    loadTasks();
  }, []);

  // Guardar en localStorage
  useEffect(() => {
    localStorage.setItem("todos", JSON.stringify(todos));
  }, [todos]);

  // new task in the backend
  const addTask = async (status = "todo") => {
    try {
      const res = await fetch(`${API_URL}/tasks`, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
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

      // add a new task
      setTodos((prev) => [...prev, newTask]);
    } catch (error) {
      console.error("Error creating task:", error);
    }
  };

  // delete task
  const handleDelete = async (id) => {
    try {
      const res = await fetch(`${API_URL}/tasks/${id}`, {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (!res.ok) throw new Error("Error deleting task");

      const data = await res.json();
      console.log(data);

      setTodos((prev) => prev.filter((t) => t.id !== id));
    } catch (err) {
      console.error("❌ Error deleting task:", err);
    }
  };

  // edit task
  const handleEdit = async (id, newText) => {
    try {
      const task = todos.find((t) => t.id === id);
      if (!task) return;

      const res = await fetch(`${API_URL}/tasks/${id}`, {
        method: "PUT",
        headers: {
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          text: newText,
          status: task.status,
        }),
      });

      if (!res.ok) throw new Error("Error updating task");

      const updatedTask = await res.json();
      setTodos((prev) => prev.map((t) => (t.id === id ? updatedTask : t)));
    } catch (err) {
      console.error("❌ Error editing task:", err);
    }
  };

  // change the status
  const handleStatusChange = async (id, newStatus) => {
    try {
      const task = todos.find((t) => t.id === id);
      if (!task) return;
      const token = await getAccessTokenSilently();

      const res = await fetch(`${API_URL}/tasks/${id}`, {
        method: "PUT",
        headers: {
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          text: task.text,
          status: newStatus,
        }),
      });

      if (!res.ok) throw new Error("Error updating status");
      const updatedTask = await res.json();

      setTodos((prev) => prev.map((t) => (t.id === id ? updatedTask : t)));
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

TodoList.propTypes = {
  isAuthenticated: PropTypes.bool,
  user: PropTypes.object,
};
