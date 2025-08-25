import React, { useState } from "react";

export default function TodoItem({
  id,
  text,
  onDelete,
  onEdit,
  onStatusChange,
}) {
  const [editText, setEditText] = useState(text);

  const handleBlur = () => {
    if (editText.trim() && editText !== text) {
      onEdit(id, editText.trim());
    }
  };

  const handleKeyDown = (e) => {
    if (e.key === "Enter" && editText.trim()) {
      onEdit(id, editText.trim());
      setEditText("");
    }
  };

  return (
    <li className="bg-white border rounded-xl shadow flex flex-col px-4 py-2 hover:bg-gray-100 transition">
      <textarea
        value={editText}
        onChange={(e) => setEditText(e.target.value)}
        onBlur={handleBlur}
        onKeyDown={handleKeyDown}
        placeholder="Add a new task..."
        className="flex-1 px-2 py-1 border rounded focus:outline-none focus:ring-2 resize-none"
      />
      <div className="flex space-x-2 justify-end mt-2">
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
