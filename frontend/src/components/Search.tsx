import React from "react";

interface SearchProps {
  search: string;
  setSearch: React.Dispatch<React.SetStateAction<string>>;
}

export default function Search({ search, setSearch }: SearchProps) {
  return (
    <input
      type="text"
      placeholder="🔍 Search tasks..."
      value={search}
      onChange={(e) => setSearch(e.target.value)}
      className="px-4 py-2 rounded-xl border border-gray-300 bg-white shadow-sm focus:outline-none focus:ring-2 focus:ring-orange-400 focus:border-orange-400 transition-all duration-200 w-96 hover:shadow-md text-base"
    />
  );
}
