import React, { useState, forwardRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import StickyNote from "./StickyNote";

function getColorClass() {
  const colors = [
    "bg-gradient-to-br from-blue-100 to-blue-200 border-blue-400",
    "bg-gradient-to-br from-green-100 to-green-200 border-green-400",
    "bg-gradient-to-br from-yellow-100 to-yellow-200 border-yellow-400",
    "bg-gradient-to-br from-pink-100 to-pink-200 border-pink-400",
    "bg-gradient-to-br from-purple-100 to-purple-200 border-purple-400",
    "bg-gradient-to-br from-indigo-100 to-indigo-200 border-indigo-400",
    "bg-gradient-to-br from-red-100 to-red-200 border-red-400",
    "bg-gradient-to-br from-orange-100 to-orange-200 border-orange-400",
  ];
  return colors[Math.floor(Math.random() * colors.length)];
}

const Column = forwardRef(function Column(
  {
    title,
    tasks,
    onDelete,
    onEdit,
    onStatusChange,
    bgColor,
    textColor,
    columnStatus,
    addTask,
  },
  ref
) {
  const [hovered, setHovered] = useState(false);
  const [isOver, setIsOver] = useState(false);

  const taskCount = tasks.length;

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
      if (taskData.status !== columnStatus) {
        onStatusChange(taskData.id, columnStatus);
      }
    } catch (err) {
      console.error("Error parsing dropped data:", err);
    }
  };

  return (
    <motion.div
      ref={ref}
      className={`flex-1 min-w-[280px] sm:min-w-[320px] p-4 rounded-xl transition-all duration-200 ${
        isOver ? "bg-opacity-50 scale-[1.01]" : ""
      }`}
      onDragOver={handleDragOver}
      onDragLeave={handleDragLeave}
      onDrop={handleDrop}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      <div className={`${bgColor} ${textColor} p-4 rounded-t-xl shadow-lg`}>
        <div className="flex items-center justify-between">
          <h2 className="text-xl sm:text-2xl font-bold">{title}</h2>

          <div className="flex items-center space-x-2">
            <motion.button
              className="w-10 h-10 bg-white bg-opacity-20 hover:bg-opacity-30 text-white rounded-full flex items-center justify-center font-bold text-2xl transition-all duration-200"
              onHoverStart={() => setHovered(true)}
              onHoverEnd={() => setHovered(false)}
              whileTap={{ scale: 0.95 }}
              onClick={() => addTask(columnStatus)}
            >
              <motion.span
                animate={{ rotate: hovered ? 180 : 0 }}
                transition={{ type: "spring", stiffness: 500, damping: 20 }}
              >
                +
              </motion.span>
            </motion.button>

            <div className="w-10 h-10 bg-white bg-opacity-20 text-white rounded-full flex items-center justify-center font-medium text-lg">
              {taskCount}
            </div>
          </div>
        </div>
      </div>

      <div
        className="p-4 rounded-b-xl shadow-lg min-h-[400px] space-y-4"
        style={{
          backgroundImage: `radial-gradient(circle at 25% 25%, rgb(212, 197, 169) 2px, transparent 2px),
                            radial-gradient(circle at 75% 25%, rgb(212, 197, 169) 2px, transparent 2px),
                            radial-gradient(circle at 25% 75%, rgb(212, 197, 169) 2px, transparent 2px),
                            radial-gradient(circle at 75% 75%, rgb(212, 197, 169) 2px, transparent 2px)`,
          backgroundSize: "30px 30px",
        }}
      >
        <AnimatePresence mode="popLayout">
          {tasks.map((task) => (
            <StickyNote
              key={task.id}
              id={task.id}
              text={task.text}
              status={task.status}
              onEdit={onEdit}
              onStatusChange={onStatusChange}
              onDelete={() => onDelete(task.id)}
              colorClass={getColorClass(columnStatus)}
            />
          ))}
        </AnimatePresence>
      </div>
    </motion.div>
  );
});

export default Column;
