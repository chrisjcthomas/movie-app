import { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { AiOutlineSearch } from "react-icons/ai";
import { debounce } from "lodash";
import { cn } from "@/utils/helper";
import { API_KEY, TMDB_API_BASE_URL } from "@/utils/config";
import SearchResults from "./SearchResults";

interface SearchResult {
  id: number;
  title?: string;
  name?: string;
  media_type: string;
  poster_path: string;
}

const Search = () => {
  const [query, setQuery] = useState("");
  const [results, setResults] = useState<SearchResult[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isOpen, setIsOpen] = useState(false);
  const searchRef = useRef<HTMLDivElement>(null);
  const navigate = useNavigate();

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (searchRef.current && !searchRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const searchMovies = async (searchQuery: string) => {
    if (!searchQuery.trim()) {
      setResults([]);
      return;
    }

    setIsLoading(true);
    try {
      const [moviesResponse, tvResponse] = await Promise.all([
        fetch(
          `${TMDB_API_BASE_URL}/search/movie?api_key=${API_KEY}&query=${searchQuery}`
        ),
        fetch(
          `${TMDB_API_BASE_URL}/search/tv?api_key=${API_KEY}&query=${searchQuery}`
        ),
      ]);

      const [moviesData, tvData] = await Promise.all([
        moviesResponse.json(),
        tvResponse.json(),
      ]);

      const combinedResults = [
        ...moviesData.results.map((item: any) => ({
          ...item,
          media_type: "movie",
        })),
        ...tvData.results.map((item: any) => ({ ...item, media_type: "tv" })),
      ]
        .sort((a, b) => b.popularity - a.popularity)
        .slice(0, 8);

      setResults(combinedResults);
    } catch (error) {
      console.error("Search error:", error);
      setResults([]);
    } finally {
      setIsLoading(false);
    }
  };

  const debouncedSearch = debounce(searchMovies, 300);

  useEffect(() => {
    debouncedSearch(query);
  }, [query]);

  const handleResultClick = (result: SearchResult) => {
    navigate(`/${result.media_type}/${result.id}`);
    setIsOpen(false);
    setQuery("");
  };

  return (
    <div ref={searchRef} className="relative w-full max-w-md">
      <div className="relative">
        <input
          type="text"
          value={query}
          onChange={(e) => {
            setQuery(e.target.value);
            setIsOpen(true);
          }}
          onFocus={() => setIsOpen(true)}
          placeholder="Search movies & TV shows..."
          className={cn(
            "w-full px-4 py-2 pr-10 rounded-full transition-all duration-200",
            "bg-gray-100 dark:bg-gray-800 border border-transparent",
            "focus:outline-none focus:border-gray-300 dark:focus:border-gray-600",
            "placeholder-gray-500 dark:placeholder-gray-400",
            "text-gray-900 dark:text-gray-100"
          )}
        />
        <AiOutlineSearch
          className={cn(
            "absolute right-3 top-1/2 -translate-y-1/2 w-5 h-5",
            "text-gray-500 dark:text-gray-400"
          )}
        />
      </div>

      {isOpen && (
        <SearchResults
          results={results}
          isLoading={isLoading}
          onResultClick={handleResultClick}
          query={query}
        />
      )}
    </div>
  );
};