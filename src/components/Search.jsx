import React from "react";

export default function SearchBar({ search, setSearch }) {
  return (
    <div className="mb-6">
      <input
        type="text"
        value={search}
        onChange={(e) => setSearch(e.target.value)}
        placeholder="🔍 Search tasks..."
        className="w-full max-w-md mx-auto block border border-gray-300 px-4 py-3 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 shadow-sm"
      />
    </div>
  );
}
