import { useState, useEffect } from "react";
import { FiLoader } from "react-icons/fi";

import { MovieCard, SkelatonLoader } from "@/common";
import { CalendarHeader } from "./components";
import { useGetUpcomingShowsQuery } from "@/services/TMDB";
import { smallMaxWidth } from "@/styles";
import { IMovie } from "@/types";

const Calendar = () => {
  const [page, setPage] = useState(1);
  const [shows, setShows] = useState<IMovie[]>([]);
  const [activeCategory, setActiveCategory] = useState<"movie" | "tv">("movie");

  const { data, isLoading, isFetching } = useGetUpcomingShowsQuery({
    category: activeCategory,
    page,
  });

  useEffect(() => {
    if (isLoading || isFetching) return;

    if (data?.results) {
      if (page > 1) {
        setShows((prev) => [...prev, ...data.results]);
      } else {
        setShows([...data.results]);
      }
    }
  }, [data, isFetching, isLoading, page]);

  const handleCategoryChange = (category: "movie" | "tv") => {
    setActiveCategory(category);
    setPage(1);
    setShows([]);
  };

  return (
    <>
      <CalendarHeader />
      <section className={smallMaxWidth}>
        <div className="flex justify-center gap-4 lg:py-10 md:pt-9 md:pb-10 sm:pt-8 sm:pb-10 pt-6 pb-8">
          <button
            onClick={() => handleCategoryChange("movie")}
            className={`px-4 py-2 rounded-full transition-all duration-300 ${
              activeCategory === "movie"
                ? "bg-red-600 text-white"
                : "dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-800"
            }`}
          >
            Movies
          </button>
          <button
            onClick={() => handleCategoryChange("tv")}
            className={`px-4 py-2 rounded-full transition-all duration-300 ${
              activeCategory === "tv"
                ? "bg-red-600 text-white"
                : "dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-800"
            }`}
          >
            Series
          </button>
        </div>

        {isLoading ? (
          <SkelatonLoader isMoviesSliderLoader={false} />
        ) : (
          <div className="flex flex-wrap xs:gap-4 gap-[14px] justify-center">
            {shows?.map((show) => (
              <div
                key={show.id}
                className="flex flex-col xs:gap-4 gap-2 xs:max-w-[170px] max-w-[124px] rounded-lg lg:mb-6 md:mb-5 sm:mb-4 mb-[10px]"
              >
                <MovieCard movie={show} category={activeCategory} />
              </div>
            ))}
          </div>
        )}

        {isFetching && !isLoading ? (
          <div className="my-4">
            <FiLoader className="mx-auto dark:text-gray-300 w-5 h-5 animate-spin" />
          </div>
        ) : (
          <div className="w-full flex items-center justify-center">
            <button
              type="button"
              onClick={() => setPage(page + 1)}
              disabled={isFetching}
              className="sm:py-2 xs:py-[6px] py-1 sm:px-4 xs:px-3 px-[10.75px] bg-[#ff0000] text-gray-50 rounded-full md:text-[15.25px] sm:text-[14.75px] xs:text-[14px] text-[12.75px] shadow-md hover:-translate-y-1 transition-all duration-300 font-medium font-nunito my-4"
            >
              Load more
            </button>
          </div>
        )}
      </section>
    </>
  );
};

export default Calendar;