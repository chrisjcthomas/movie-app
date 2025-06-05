import { useGetShowsQuery } from "@/services/TMDB";
import SearchBar from "./SearchBar";

const MovieSearchBar = () => {
  return <SearchBar category="movie" />;
};

export default MovieSearchBar;