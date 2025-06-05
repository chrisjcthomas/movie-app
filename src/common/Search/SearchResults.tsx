import { cn } from "@/utils/helper";

interface SearchResult {
  id: number;
  title?: string;
  name?: string;
  media_type: string;
  poster_path: string;
}

interface SearchResultsProps {
  results: SearchResult[];
  isLoading: boolean;
  onResultClick: (result: SearchResult) => void;
  query: string;
}

const SearchResults = ({
  results,
  isLoading,
  onResultClick,
  query,
}: SearchResultsProps) => {
  if (!query) return null;

  return (
    <div
      className={cn(
        "absolute top-full left-0 right-0 mt-2",
        "bg-white dark:bg-gray-800 rounded-lg shadow-lg",
        "border border-gray-200 dark:border-gray-700",
        "max-h-[400px] overflow-y-auto"
      )}
    >
      {isLoading ? (
        <div className="p-4 text-center text-gray-500 dark:text-gray-400">
          Searching...
        </div>
      ) : results.length > 0 ? (
        <ul className="py-2">
          {results.map((result) => (
            <li key={`${result.media_type}-${result.id}`}>
              <button
                onClick={() => onResultClick(result)}
                className={cn(
                  "w-full px-4 py-2 text-left",
                  "hover:bg-gray-100 dark:hover:bg-gray-700",
                  "transition-colors duration-150"
                )}
              >
                <div className="flex items-center">
                  {result.poster_path && (
                    <img
                      src={`https://image.tmdb.org/t/p/w92${result.poster_path}`}
                      alt={result.title || result.name}
                      className="w-8 h-12 object-cover rounded mr-3"
                    />
                  )}
                  <div>
                    <div className="text-sm font-medium text-gray-900 dark:text-gray-100">
                      {result.title || result.name}
                    </div>
                    <div className="text-xs text-gray-500 dark:text-gray-400 capitalize">
                      {result.media_type}
                    </div>
                  </div>
                </div>
              </button>
            </li>
          ))}
        </ul>
      ) : (
        <div className="p-4 text-center text-gray-500 dark:text-gray-400">
          No results found
        </div>
      )}
    </div>
  );
};

export default SearchResults;