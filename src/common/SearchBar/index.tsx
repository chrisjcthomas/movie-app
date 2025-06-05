import { useState, useRef, useEffect } from "react";
import { FiSearch } from "react-icons/fi";
import { useDebounce } from "usehooks-ts";
import { useNavigate } from "react-router-dom";
import { useGetShowsQuery } from "@/services/TMDB";
import { cn } from "@/utils/helper";

interface SearchBarProps {
  className?: string;
  category?: string;
}

const SearchBar = ({ className, category = "movie" }: SearchBarProps) => {
  const [query, setQuery] = useState("");
  const [isOpen, setIsOpen] = useState(false);
  const [selectedIndex, setSelectedIndex] = useState(-1);
  const debouncedQuery = useDebounce(query, 300);
  const navigate = useNavigate();
  const searchRef = useRef<HTMLDivElement>(null);

  const { data, isFetching } = useGetShowsQuery(
    {
      category,
      searchQuery: debouncedQuery,
      page: 1,
    },
    {
      skip: debouncedQuery.length < 2,
    }
  );

  const suggestions = data?.results?.slice(0, 5) || [];

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (searchRef.current && !searchRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (!isOpen) return;

    switch (e.key) {
      case "ArrowDown":
        e.preventDefault();
        setSelectedIndex((prev) =>
          prev < suggestions.length - 1 ? prev + 1 : prev
        );
        break;
      case "ArrowUp":
        e.preventDefault();
        setSelectedIndex((prev) => (prev > 0 ? prev - 1 : -1));
        break;
      case "Enter":
        e.preventDefault();
        if (selectedIndex >= 0) {
          const selected = suggestions[selectedIndex];
          navigate(`/${category}/${selected.id}`);
          setIsOpen(false);
          setQuery("");
        }
        break;
      case "Escape":
        setIsOpen(false);
        break;
    }
  };

  const handleQueryChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setQuery(value);
    setSelectedIndex(-1);
    setIsOpen(value.length >= 2);
  };

  const handleSuggestionClick = (id: string) => {
    navigate(`/${category}/${id}`);
    setIsOpen(false);
    setQuery("");
  };

  const highlightMatch = (text: string) => {
    if (!query) return text;
    const regex = new RegExp(`(${query})`, "gi");
    return text.split(regex).map((part, i) =>
      regex.test(part) ? (
        <span key={i} className="bg-yellow-200 dark:bg-yellow-900">
          {part}
        </span>
      ) : (
        part
      )
    );
  };

  return (
    <div ref={searchRef} className={cn("relative w-full", className)}>
      <div className="relative">
        <input
          type="text"
          value={query}
          onChange={handleQueryChange}
          onKeyDown={handleKeyDown}
          onFocus={() => query.length >= 2 && setIsOpen(true)}
          placeholder="Search movies and TV shows..."
          className="w-full py-2 px-4 pr-10 rounded-full bg-gray-100 dark:bg-gray-800 focus:outline-none"
        />
        <FiSearch className="absolute right-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-500 dark:text-gray-400" />
      </div>

      {isOpen && (query.length >= 2) && (
        <div className="absolute z-50 w-full mt-2 bg-white dark:bg-gray-800 rounded-lg shadow-lg max-h-96 overflow-auto">
          {isFetching ? (
            <div className="p-4 text-center text-gray-500 dark:text-gray-400">
              Searching...
            </div>
          ) : suggestions.length > 0 ? (
            <ul>
              {suggestions.map((item, index) => (
                <li
                  key={item.id}
                  onClick={() => handleSuggestionClick(item.id)}
                  className={cn(
                    "px-4 py-2 cursor-pointer hover:bg-gray-100 dark:hover:bg-gray-700",
                    index === selectedIndex && "bg-gray-100 dark:bg-gray-700"
                  )}
                >
                  <div className="font-medium">
                    {highlightMatch(item.title || item.name)}
                  </div>
                  {item.overview && (
                    <div className="text-sm text-gray-500 dark:text-gray-400 truncate">
                      {highlightMatch(item.overview)}
                    </div>
                  )}
                </li>
              ))}
            </ul>
          ) : (
            <div className="p-4 text-center text-gray-500 dark:text-gray-400">
              No results found
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default SearchBar;