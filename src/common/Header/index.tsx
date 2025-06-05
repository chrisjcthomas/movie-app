import { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";
import { AnimatePresence } from "framer-motion";
import { BsMoonStarsFill } from "react-icons/bs";
import { AiOutlineMenu } from "react-icons/ai";
import { FiSun, FiSearch, FiSave, FiSettings } from "react-icons/fi";
import throttle from "lodash.throttle";

import { ThemeMenu, Logo } from "..";
import HeaderNavItem from "./HeaderNavItem";

import { useGlobalContext } from "@/context/globalContext";
import { useTheme } from "@/context/themeContext";
import { maxWidth, textColor } from "@/styles";
import { navLinks } from "@/constants";
import { THROTTLE_DELAY } from "@/utils/config";
import { cn } from "@/utils/helper";

const Header = () => {
  const { openMenu, theme, showThemeOptions } = useTheme();
  const { setShowSidebar } = useGlobalContext();
  const [searchQuery, setSearchQuery] = useState("");

  const [isActive, setIsActive] = useState<boolean>(false);
  const [isNotFoundPage, setIsNotFoundPage] = useState<boolean>(false);
  const location = useLocation();

  useEffect(() => {
    const handleBackgroundChange = () => {
      const body = document.body;
      if (
        window.scrollY > 0 ||
        (body.classList.contains("no-scroll") &&
          parseFloat(body.style.top) * -1 > 0)
      ) {
        setIsActive(true);
      } else {
        setIsActive(false);
      }
    };

    const throttledHandleBackgroundChange = throttle(
      handleBackgroundChange,
      THROTTLE_DELAY
    );

    window.addEventListener("scroll", throttledHandleBackgroundChange);

    return () => {
      window.removeEventListener("scroll", throttledHandleBackgroundChange);
    };
  }, []);

  useEffect(() => {
    if (location.pathname.split("/").length > 3) {
      setIsNotFoundPage(true);
    } else {
      setIsNotFoundPage(false);
    }
  }, [location.pathname]);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    // Implement search functionality
    console.log("Search:", searchQuery);
  };

  return (
    <header
      className={cn(
        `md:py-[16px] py-[14.5px] fixed top-0 left-0 w-full z-10 transition-all duration-50`,
        isActive && (theme === "Dark" ? "header-bg--dark" : "header-bg--light")
      )}
    >
      <nav className={cn(maxWidth, `flex justify-between flex-row items-center`)}>
        <div className="flex items-center gap-8">
          <Logo
            logoColor={cn(
              isNotFoundPage
                ? "text-black dark:text-primary"
                : !isNotFoundPage && isActive
                ? "text-black dark:text-primary"
                : "text-primary"
            )}
          />

          <ul className="hidden md:flex flex-row gap-8 capitalize text-[14.75px] font-medium">
            {navLinks.map((link) => (
              <HeaderNavItem
                key={link.title}
                link={link}
                isNotFoundPage={isNotFoundPage}
                showBg={isActive}
              />
            ))}
          </ul>
        </div>

        <form
          onSubmit={handleSearch}
          className="hidden md:flex items-center max-w-md w-full mx-4"
        >
          <div className="relative w-full">
            <input
              type="text"
              placeholder="Search movies and TV shows..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full py-2 px-4 pr-10 rounded-full bg-gray-100 dark:bg-gray-800 focus:outline-none"
            />
            <button
              type="submit"
              className="absolute right-3 top-1/2 -translate-y-1/2"
            >
              <FiSearch className="w-5 h-5 text-gray-500 dark:text-gray-400" />
            </button>
          </div>
        </form>

        <div className="hidden md:flex items-center gap-4">
          <button
            type="button"
            className={cn(
              "p-2 rounded-full hover:bg-gray-200 dark:hover:bg-gray-800",
              isNotFoundPage || isActive
                ? textColor
                : "text-gray-300 hover:text-secColor"
            )}
          >
            <FiSave className="w-5 h-5" />
          </button>
          <button
            type="button"
            className={cn(
              "p-2 rounded-full hover:bg-gray-200 dark:hover:bg-gray-800",
              isNotFoundPage || isActive
                ? textColor
                : "text-gray-300 hover:text-secColor"
            )}
          >
            <FiSettings className="w-5 h-5" />
          </button>
          <button
            type="button"
            onClick={openMenu}
            className={cn(
              "p-2 rounded-full hover:bg-gray-200 dark:hover:bg-gray-800",
              isNotFoundPage || isActive
                ? textColor
                : "text-gray-300 hover:text-secColor"
            )}
          >
            {theme === "Dark" ? (
              <BsMoonStarsFill className="w-5 h-5" />
            ) : (
              <FiSun className="w-5 h-5" />
            )}
          </button>
          <AnimatePresence>{showThemeOptions && <ThemeMenu />}</AnimatePresence>
        </div>

        <button
          type="button"
          name="menu"
          className={cn(
            `inline-block text-[22.75px] md:hidden transition-all duration-300`,
            isNotFoundPage || isActive
              ? `${textColor} dark:hover:text-secColor hover:text-black `
              : ` dark:hover:text-secColor text-secColor`
          )}
          onClick={() => setShowSidebar(true)}
        >
          <AiOutlineMenu />
        </button>
      </nav>
    </header>
  );
};

export default Header