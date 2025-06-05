import { useGetShowsQuery } from "@/services/TMDB";
import SearchBar from "./SearchBar";

const SeriesSearchBar = () => {
  return <SearchBar category="tv" />;
};

export default SeriesSearchBar;