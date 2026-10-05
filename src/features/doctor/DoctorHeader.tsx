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
    <div className="mb-8 relative z-10">
      <div className="bg-white rounded-2xl shadow-sm border border-gray-200 flex items-center w-full max-w-3xl focus-within:ring-4 focus-within:ring-blue-500/20 focus-within:border-blue-500 overflow-hidden transition-all duration-300 group hover:shadow-md">
        <div className="pl-5 text-gray-400 flex items-center justify-center group-focus-within:text-blue-500 transition-colors">
          <Search size={22} />
        </div>
        <input
          type="text"
          placeholder="Search patient by ID (e.g. 2204001) or press Enter..."
          className="flex-1 bg-transparent border-none outline-none px-4 py-4 text-gray-800 placeholder-gray-400 font-medium text-base w-full"
          value={id}
          onChange={(e) => setId(e.target.value)}
          onKeyDown={handleKeyDown}
        />
        <button 
          onClick={handleSearch}
          className="bg-gray-900 text-white hover:bg-blue-600 transition-colors duration-300 px-8 py-4 font-bold text-sm tracking-wide h-full uppercase"
        >
          Search
        </button>
      </div>
    </div>
  );
}