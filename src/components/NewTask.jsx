import React, { useRef } from 'react';

function NewTask({ taskText, setTaskText, addTask }) {
  const inputRef = useRef(null);

  const handleKeyPress = (e) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      handleAddTask();
    }
  };

  const handleAddTask = () => {
    if (taskText.trim() !== '') {
      addTask();
      setTaskText(''); 
      inputRef.current?.focus();
    }
  };

  return (
        <div className="
        pb-8               
        p-8                
        bg-gray-100 bg-opacity-80
        rounded-xl
        shadow-lg
        flex
        items-center
        justify-between
        space-x-4
        overflow-hidden
        ">
      <input
        ref={inputRef}
        type="text"
        className="
          flex-grow px-6 py-4 text-xl bg-white text-gray-900 placeholder-gray-400
          focus:outline-none focus:ring-4 focus:ring-pink-400

        "
        placeholder="Add a new task..."
        value={taskText}
        onChange={(e) => setTaskText(e.target.value)}
        onKeyDown={handleKeyPress}
      />
        <button
        className="
            bg-pink-500 text-white px-8 py-4 text-xl font-semibold
            hover:bg-pink-600 active:bg-pink-700
            transition duration-200
            shadow-md hover:shadow-lg active:shadow-inner
            transform active:scale-95 cursor-pointer
            animate-pulse-slow
        "
        onClick={handleAddTask}
        type="button"
        >
        Add
        </button>
    </div>
  );
}

export default NewTask;

