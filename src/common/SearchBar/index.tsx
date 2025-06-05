import { useState, useRef, useEffect } from "react";
import { FiSearch } from "react-icons/fi";
import { useDebounce } from "usehooks-ts";
import { useNavigate } from "react-router-dom";
import { useGetShowsQuery } from "@/services/TMDB";
import { cn } from "@/utils/helper";
import { IMovie } from "@/types";

interface SearchBarProps {
  className?: string;
}

const SearchBar = ({ className }: SearchBarProps) => {
  const [query, setQuery] = useState("");
  const [isOpen, setIsOpen] = useState(false);
  const [selectedIndex, setSelectedIndex] = useState(-1);
  const [combinedResults, setCombinedResults] = useState<IMovie[]>([]);
  const debouncedQuery = useDebounce(query, 300);
  const navigate = useNavigate();
  const searchRef = useRef<HTMLDivElement>(null);

  const { data: movieData, isFetching: isMoviesFetching } = useGetShowsQuery(
    {
      category: "movie",
      searchQuery: debouncedQuery,
      page: 1,
    },
    {
      skip: debouncedQuery.length < 2,
    }
  );

  const { data: tvData, isFetching: isTvFetching } = useGetShowsQuery(
    {
      category: "tv",
      searchQuery: debouncedQuery,
      page: 1,
    },
    {
      skip: debouncedQuery.length < 2,
    }
  );

  useEffect(() => {
    if (movieData?.results && tvData?.results) {
      const movies = movieData.results.map(movie => ({ ...movie, mediaType: 'movie' }));
      const tvShows = tvData.results.map(show => ({ ...show, mediaType: 'tv' }));
      
      // Combine and sort by popularity (assuming both have similar popularity metrics)
      const combined = [...movies, ...tvShows]
        .sort((a, b) => (b.popularity || 0) - (a.popularity || 0))
        .slice(0, 5);
      
      setCombinedResults(combined);
    }
  }, [movieData, tvData]);

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
          prev < combinedResults.length - 1 ? prev + 1 : prev
        );
        break;
      case "ArrowUp":
        e.preventDefault();
        setSelectedIndex((prev) => (prev > 0 ? prev - 1 : -1));
        break;
      case "Enter":
        e.preventDefault();
        if (selectedIndex >= 0) {
          const selected = combinedResults[selectedIndex];
          navigate(`/${selected.mediaType}/${selected.id}`);
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

  const handleSuggestionClick = (id: string, mediaType: string) => {
    navigate(`/${mediaType}/${id}`);
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

  const getYear = (item: IMovie) => {
    const date = item.release_date || item.first_air_date;
    return date ? new Date(date).getFullYear() : null;
  };

  const isLoading = isMoviesFetching || isTvFetching;

  return (
    <div ref={searchRef} className={cn("relative w-full", className)}>
      <div className="relative">
        <input
          type="text"
          value={query}
          onChange={handleQueryChange}
          onKeyDown={handleKeyDown}
          onFocus={() => query.length >= 2 && setIsOpen(true)}
          placeholder="Search movies and series..."
          className="w-full py-2 px-4 pr-10 rounded-full bg-gray-100 dark:bg-gray-800 focus:outline-none"
        />
        <FiSearch className="absolute right-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-500 dark:text-gray-400" />
      </div>

      {isOpen && query.length >= 2 && (
        <div className="absolute z-50 w-full mt-2 bg-white dark:bg-gray-800 rounded-lg shadow-lg overflow-hidden">
          {isLoading ? (
            <div className="p-4 text-center text-gray-500 dark:text-gray-400">
              Searching...
            </div>
          ) : combinedResults.length > 0 ? (
            <ul>
              {combinedResults.map((item, index) => (
                <li
                  key={item.id}
                  onClick={() => handleSuggestionClick(item.id, item.mediaType)}
                  className={cn(
                    "p-2 cursor-pointer hover:bg-gray-100 dark:hover:bg-gray-700 flex items-center gap-3",
                    index === selectedIndex && "bg-gray-100 dark:bg-gray-700"
                  )}
                >
                  <img
                    src={`https://image.tmdb.org/t/p/w92${item.poster_path}`}
                    alt={item.title || item.name}
                    className="w-10 h-15 object-cover rounded"
                    onError={(e) => {
                      (e.target as HTMLImageElement).src = 'https://via.placeholder.com/92x138?text=No+Image';
                    }}
                  />
                  <div className="flex flex-col">
                    <span className="font-medium">
                      {highlightMatch(item.title || item.name)}
                    </span>
                    {getYear(item) && (
                      <span className="text-xs text-gray-500 dark:text-gray-400">
                        {getYear(item)}
                      </span>
                    )}
                  </div>
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