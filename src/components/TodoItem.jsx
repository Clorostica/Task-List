import React from 'react';

export default function TodoItem({ text, onDelete, onEdit }) {
  return (
    <li className="bg-white border rounded-xl shadow flex justify-between items-center px-4 py-2 hover:bg-gray-100 transition">
      <span className="flex-grow pr-4">{text}</span>
      <div className="space-x-2">
      <button
  onClick={onEdit}
  className="
    bg-yellow-400 text-white px-3 py-1 rounded 
    hover:bg-yellow-500 hover:scale-105 
    transition transform duration-200 ease-in-out
    shadow-sm hover:shadow-md
    focus:outline-none focus:ring-2 focus:ring-yellow-300
  "
>
  Edit
</button>
<button
  onClick={onDelete}
  className="
    bg-red-500 text-white px-3 py-1 rounded 
    hover:bg-red-600 hover:scale-105 
    transition transform duration-200 ease-in-out
    shadow-sm hover:shadow-md
    focus:outline-none focus:ring-2 focus:ring-red-400
  "
>
  Delete
</button>
      </div>
    </li>
  );
}
