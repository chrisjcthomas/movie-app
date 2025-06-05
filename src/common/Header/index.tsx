import { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";
import { AnimatePresence } from "framer-motion";
import { BsMoonStarsFill, BsBookmark } from "react-icons/bs";
import { AiOutlineSearch, AiOutlineUser, AiOutlineCalendar } from "react-icons/ai";
import { FiSun } from "react-icons/fi";
import throttle from "lodash.throttle";

import { ThemeMenu, Logo } from "..";
import HeaderNavItem from "./HeaderNavItem";

import { useGlobalContext } from "@/context/globalContext";
import { useTheme } from "@/context/themeContext";
import { maxWidth, textColor } from "@/styles";
import { THROTTLE_DELAY } from "@/utils/config";
import { cn } from "@/utils/helper";

const navLinks = [
  { title: "Home", path: "/" },
  { title: "Movies", path: "/movie" },
  { title: "TV Series", path: "/tv" },
  { title: "Calendar", path: "/calendar" },
];

const Header = () => {
  const { openMenu, theme, showThemeOptions } = useTheme();
  const [isActive, setIsActive] = useState<boolean>(false);
  const [searchQuery, setSearchQuery] = useState<string>("");
  const location = useLocation();

  useEffect(() => {
    const handleBackgroundChange = () => {
      if (window.scrollY > 0) {
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

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (!searchQuery.trim()) return;
    // Implement search functionality
    console.log("Searching for:", searchQuery);
  };

  return (
    <header
      className={cn(
        `fixed top-0 left-0 w-full z-50 transition-all duration-300`,
        isActive && (theme === "Dark" ? "header-bg--dark" : "header-bg--light")
      )}
    >
      <div className={cn(maxWidth, "h-16")}>
        <nav className="flex items-center justify-between h-full">
          {/* Left Section */}
          <div className="flex items-center space-x-8">
            <Logo 
              logoColor={cn(
                "transition-colors duration-200",
                theme === "Dark" ? "text-primary" : "text-black"
              )} 
            />
            <ul className="hidden md:flex items-center space-x-6">
              {navLinks.map((link) => (
                <HeaderNavItem
                  key={link.path}
                  link={link}
                  isNotFoundPage={false}
                  showBg={isActive}
                />
              ))}
            </ul>
          </div>

          {/* Center Section - Search */}
          <form
            onSubmit={handleSearch}
            className="hidden md:flex items-center max-w-md w-full mx-4"
          >
            <div className="relative w-full">
              <input
                type="text"
                placeholder="Search..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className={cn(
                  "w-full px-4 py-2 rounded-full transition-all duration-200",
                  "bg-gray-100 dark:bg-gray-800 border border-transparent",
                  "focus:outline-none focus:border-gray-300 dark:focus:border-gray-600",
                  "placeholder-gray-500 dark:placeholder-gray-400",
                  "text-gray-900 dark:text-gray-100"
                )}
              />
              <button
                type="submit"
                className={cn(
                  "absolute right-3 top-1/2 -translate-y-1/2",
                  "text-gray-500 dark:text-gray-400",
                  "hover:text-gray-700 dark:hover:text-gray-200",
                  "transition-colors duration-200"
                )}
              >
                <AiOutlineSearch className="w-5 h-5" />
              </button>
            </div>
          </form>

          {/* Right Section */}
          <div className="flex items-center space-x-2">
            {/* Bookmark Button */}
            <button
              type="button"
              className={cn(
                "p-2 rounded-full transition-all duration-200",
                "hover:bg-gray-100 dark:hover:bg-gray-800",
                "text-gray-700 dark:text-gray-300",
                "hover:text-gray-900 dark:hover:text-gray-100"
              )}
              aria-label="Bookmarks"
            >
              <BsBookmark className="w-5 h-5" />
            </button>

            {/* Profile Button */}
            <button
              type="button"
              className={cn(
                "p-2 rounded-full transition-all duration-200",
                "hover:bg-gray-100 dark:hover:bg-gray-800",
                "text-gray-700 dark:text-gray-300",
                "hover:text-gray-900 dark:hover:text-gray-100"
              )}
              aria-label="Profile"
            >
              <AiOutlineUser className="w-5 h-5" />
            </button>

            {/* Theme Toggle */}
            <button
              type="button"
              onClick={openMenu}
              className={cn(
                "p-2 rounded-full transition-all duration-200",
                "hover:bg-gray-100 dark:hover:bg-gray-800",
                "text-gray-700 dark:text-gray-300",
                "hover:text-gray-900 dark:hover:text-gray-100"
              )}
              aria-label="Theme toggle"
            >
              {theme === "Dark" ? (
                <BsMoonStarsFill className="w-5 h-5" />
              ) : (
                <FiSun className="w-5 h-5" />
              )}
            </button>
          </div>
        </nav>
      </div>
      <AnimatePresence>
        {showThemeOptions && <ThemeMenu />}
      </AnimatePresence>
    </header>
  );
};

export default Header;