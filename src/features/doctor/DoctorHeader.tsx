import { useState } from "react";
import type { KeyboardEvent } from "react";
import { Search } from "lucide-react";

interface Props {
  onSearch: (id: string) => void;
}

export default function DoctorHeader({ onSearch }: Props) {
  const [id, setId] = useState("");

  const handleSearch = () => {
    if (!id.trim()) return;
    onSearch(id);
    setId("");
  };

  const handleKeyDown = (e: KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      handleSearch();
    }
  };

  return (
    <div className="mb-8">
      <div className="bg-white rounded-full shadow-sm border border-gray-200 flex items-center w-full max-w-2xl mx-auto focus-within:ring-2 focus-within:ring-blue-500 focus-within:border-blue-500 overflow-hidden transition-all">
        <div className="pl-4 text-gray-400 flex items-center justify-center">
          <Search size={20} />
        </div>
        <input
          type="text"
          placeholder="Search patient by ID (e.g. 2204001) or press Enter..."
          className="flex-1 bg-transparent border-none outline-none px-3 py-3 text-gray-700 placeholder-gray-400 w-full"
          value={id}
          onChange={(e) => setId(e.target.value)}
          onKeyDown={handleKeyDown}
        />
        <button 
          onClick={handleSearch}
          className="bg-blue-600 text-white hover:bg-blue-700 transition-colors px-8 py-3 font-semibold h-full"
        >
          Search
        </button>
      </div>
    </div>
  );
}