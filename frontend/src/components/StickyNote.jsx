import React, { useState, forwardRef } from "react";
import { motion } from "framer-motion";

const StickyNote = forwardRef(function StickyNote(
  { id, text, status, onEdit, onStatusChange, onDelete, colorClass },
  ref
) {
  const [editText, setEditText] = useState(text || "");
  const [isHovered, setIsHovered] = useState(false);
  const [isDragging, setIsDragging] = useState(false);

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

  const handleDragStart = (e) => {
    setIsDragging(true);
    const taskData = { id, text: editText, status };
    e.dataTransfer.setData("application/json", JSON.stringify(taskData));
    e.dataTransfer.effectAllowed = "move";
  };

  const handleDragEnd = () => {
    setIsDragging(false);
  };

  const handleButtonClick = (callback) => (e) => {
    e.preventDefault();
    e.stopPropagation();
    callback();
  };

  return (
    <motion.div
      layout
      initial={{ opacity: 0, scale: 0.8, rotate: -5 }}
      animate={{
        opacity: 1,
        scale: isDragging ? 0.95 : isHovered ? 1.08 : 1,
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
        duration: 0,
      }}
      className={`group ${colorClass} p-3 sm:p-4 rounded-lg shadow-lg border-l-4 transition-all duration-300 cursor-grab active:cursor-grabbing relative overflow-hidden`}
      draggable
      onDragStart={handleDragStart}
      onDragEnd={handleDragEnd}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      ref={ref}
    >
      <motion.div
        className="absolute -top-2 left-1/4 w-8 sm:w-12 h-4 sm:h-6 bg-white bg-opacity-70 rotate-12 shadow-sm pointer-events-none"
        animate={{
          rotate: isHovered ? 8 : 12,
          scale: isHovered ? 1.1 : 1,
        }}
        transition={{ duration: 0.1 }}
      />

      <motion.div
        className="absolute inset-0 bg-white rounded-lg pointer-events-none"
        initial={{ opacity: 0 }}
        animate={{ opacity: isHovered ? 0.1 : 0 }}
        transition={{ duration: 0.1 }}
      />

      <textarea
        value={editText}
        onChange={(e) => setEditText(e.target.value)}
        onBlur={handleBlur}
        onKeyDown={handleKeyDown}
        onDragStart={(e) => e.stopPropagation()}
        placeholder="Write your task..."
        className="w-full bg-transparent resize-none focus:outline-none text-gray-800 font-medium mt-6 sm:mt-8 relative z-10 text-sm sm:text-base"
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
            onClick={handleButtonClick(() => onStatusChange(id, "todo"))}
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
            onClick={handleButtonClick(() => onStatusChange(id, "progress"))}
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
            onClick={handleButtonClick(() => onStatusChange(id, "completed"))}
            whileHover={{ scale: 1.1, rotate: -2 }}
            whileTap={{ scale: 0.95 }}
            className="group/btn relative px-1 sm:px-2 py-1 bg-gradient-to-r from-yellow-400 to-orange-500 hover:from-yellow-500 hover:to-orange-600 rounded-full text-white text-xs font-medium shadow-lg transition-all duration-200"
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
          onClick={handleButtonClick(onDelete)}
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
        className="absolute bottom-0 right-0 w-4 sm:w-6 h-4 sm:h-6 bg-gray-300 bg-opacity-30 pointer-events-none"
        style={{ clipPath: "polygon(100% 0, 0 100%, 100% 100%)" }}
        animate={{
          scale: isHovered ? 1.2 : 1,
          opacity: isHovered ? 0.4 : 0.2,
        }}
        transition={{ duration: 0 }}
      />
    </motion.div>
  );
});

export default StickyNote;
