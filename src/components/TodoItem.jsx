import React from "react";

export default function TodoItem({
  text,
  onDelete,
  onEdit,
  completed,
  onToggle,
}) {
  return (
    <li className="bg-white border rounded-xl shadow flex justify-between items-center px-4 py-2 hover:bg-gray-100 transition">
      <div className="flex items-center flex-grow pr-4">
        <input
          type="checkbox"
          checked={completed}
          onChange={onToggle}
          className="mr-3 w-5 h-5 accent-green-500"
        />
        <span className={completed ? "line-through text-gray-400" : ""}>
          {text}
        </span>
      </div>
      <div className="space-x-2">
        <button
          onClick={onEdit}
          className="bg-yellow-400 text-white px-3 py-1 rounded hover:bg-yellow-500"
        >
          Edit
        </button>
        <button
          onClick={onDelete}
          className="bg-red-500 text-white px-3 py-1 rounded hover:bg-red-600"
        >
          Delete
        </button>
      </div>
    </li>
  );
}
