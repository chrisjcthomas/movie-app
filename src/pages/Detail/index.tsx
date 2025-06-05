import { useEffect, useState } from "react";
import { m } from "framer-motion";
import { useParams, useNavigate } from "react-router-dom";
import { BsBookmark, BsBookmarkFill } from "react-icons/bs";

import { Poster, Loader, Error, Section } from "@/common";
import { Casts, Videos, Genre } from "./components";

import { useGetShowQuery } from "@/services/TMDB";
import { useMotion } from "@/hooks/useMotion";
import { mainHeading, maxWidth, paragraph } from "@/styles";
import { cn } from "@/utils/helper";
import { useAuth } from "@/context/authContext";
import { saveMovie, removeMovie, isMovieSaved } from "@/utils/movieDb";

const Detail = () => {
  const { category, id } = useParams();
  const [show, setShow] = useState<Boolean>(false);
  const [isSaved, setIsSaved] = useState(false);
  const [isCheckingSaved, setIsCheckingSaved] = useState(true);
  const { fadeDown, staggerContainer } = useMotion();
  const { user } = useAuth();
  const navigate = useNavigate();

  const {
    data: movie,
    isLoading,
    isFetching,
    isError,
  } = useGetShowQuery({
    category: String(category),
    id: Number(id),
  });

  useEffect(() => {
    document.title =
      (movie?.title || movie?.name) && !isLoading
        ? movie.title || movie.name
        : "tMovies";

    return () => {
      document.title = "tMovies";
    };
  }, [movie?.title, isLoading, movie?.name]);

  useEffect(() => {
    const checkIfSaved = async () => {
      if (user && movie) {
        setIsCheckingSaved(true);
        const saved = await isMovieSaved(user.id, movie.id.toString());
        setIsSaved(saved);
        setIsCheckingSaved(false);
      }
    };

    checkIfSaved();
  }, [user, movie]);

  const toggleShow = () => setShow((prev) => !prev);

  const handleSaveToggle = async () => {
    if (!user) {
      navigate('/signin');
      return;
    }

    if (!movie) return;

    setIsCheckingSaved(true);
    const success = isSaved
      ? await removeMovie(user.id, movie.id.toString())
      : await saveMovie(user.id, movie, String(category));

    if (success) {
      setIsSaved(!isSaved);
    }
    setIsCheckingSaved(false);
  };

  if (isLoading || isFetching) {
    return <Loader />;
  }

  if (isError) {
    return <Error error="Something went wrong!" />;
  }

  const {
    title,
    poster_path: posterPath,
    overview,
    name,
    genres,
    videos,
    credits,
    release_date,
  } = movie;

  const year = release_date ? new Date(release_date).getFullYear() : null;

  const backgroundStyle = {
    backgroundImage: `linear-gradient(to top, rgba(0,0,0), rgba(0,0,0,0.98),rgba(0,0,0,0.8) ,rgba(0,0,0,0.4)),url('https://image.tmdb.org/t/p/original/${posterPath}'`,
    backgroundPosition: "top",
    backgroundSize: "cover",
  };

  return (
    <>
      <section className="w-full" style={backgroundStyle}>
        <div
          className={`${maxWidth} lg:py-36 sm:py-[136px] sm:pb-28 xs:py-28 xs:pb-12 pt-24 pb-8 flex flex-row lg:gap-12 md:gap-10 gap-8 justify-center`}
        >
          <Poster title={title} posterPath={posterPath} />
          <m.div
            variants={staggerContainer(0.2, 0.4)}
            initial="hidden"
            animate="show"
            className="text-gray-300 sm:max-w-[80vw] max-w-[90vw] md:max-w-[520px] font-nunito flex flex-col lg:gap-5 sm:gap-4 xs:gap-[14px] gap-3 mb-8 flex-1 will-change-transform motion-reduce:transform-none"
          >
            <div className="flex justify-between items-start">
              <m.h2
                variants={fadeDown}
                className={cn(mainHeading, "md:max-w-[420px] will-change-transform motion-reduce:transform-none")}
              >
                {title || name} {year && <span className="text-gray-400">({year})</span>}
              </m.h2>
              <button
                onClick={handleSaveToggle}
                disabled={isCheckingSaved}
                className="p-2 rounded-full hover:bg-gray-800 transition-colors"
              >
                {isSaved ? (
                  <BsBookmarkFill className="w-6 h-6 text-red-500" />
                ) : (
                  <BsBookmark className="w-6 h-6 text-gray-300" />
                )}
              </button>
            </div>

            <m.ul
              variants={fadeDown}
              className="flex flex-row items-center sm:gap-[14px] xs:gap-3 gap-[6px] flex-wrap will-change-transform motion-reduce:transform-none"
            >
              {genres.map((genre: { name: string; id: number }) => {
                return <Genre key={genre.id} name={genre.name} />;
              })}
            </m.ul>

            <m.p variants={fadeDown} className={`${paragraph} will-change-transform motion-reduce:transform-none`}>
              <span>
                {overview.length > 280
                  ? `${show ? overview : `${overview.slice(0, 280)}...`}`
                  : overview}
              </span>
              <button
                type="button"
                className={cn(
                  `font-bold ml-1 hover:underline transition-all duration-300`,
                  overview.length > 280 ? "inline-block" : "hidden"
                )}
                onClick={toggleShow}
              >
                {!show ? "show more" : "show less"}
              </button>
            </m.p>

            <Casts casts={credits?.cast || []} />
          </m.div>
        </div>
      </section>

      <Videos videos={videos.results} />

      <Section
        title={`Similar ${category === "movie" ? "movies" : "series"}`}
        category={String(category)}
        className={`${maxWidth}`}
        id={Number(id)}
        showSimilarShows
      />
    </>
  );
};

export default Detail;