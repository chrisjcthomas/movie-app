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
  const { setShowSidebar } = useGlobalContext();
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
    // Implement search functionality
    console.log("Searching for:", searchQuery);
  };

  return (
    <header
      className={cn(
        `fixed top-0 left-0 w-full z-10 transition-all duration-300 py-4`,
        isActive && (theme === "Dark" ? "header-bg--dark" : "header-bg--light")
      )}
    >
      <nav className={cn(maxWidth, "flex items-center justify-between")}>
        {/* Left Section */}
        <div className="flex items-center space-x-8">
          <Logo logoColor={theme === "Dark" ? "text-primary" : "text-black"} />
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
              className="w-full px-4 py-2 rounded-full bg-gray-100 dark:bg-gray-800 focus:outline-none"
            />
            <button
              type="submit"
              className="absolute right-3 top-1/2 -translate-y-1/2"
            >
              <AiOutlineSearch className="w-5 h-5 text-gray-500 dark:text-gray-400" />
            </button>
          </div>
        </form>

        {/* Right Section */}
        <div className="flex items-center space-x-4">
          <button
            type="button"
            className="p-2 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-full"
          >
            <BsBookmark className="w-5 h-5" />
          </button>
          <button
            type="button"
            className="p-2 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-full"
          >
            <AiOutlineUser className="w-5 h-5" />
          </button>
          <button
            type="button"
            onClick={openMenu}
            className="p-2 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-full"
          >
            {theme === "Dark" ? (
              <BsMoonStarsFill className="w-5 h-5" />
            ) : (
              <FiSun className="w-5 h-5" />
            )}
          </button>
          <AnimatePresence>
            {showThemeOptions && <ThemeMenu />}
          </AnimatePresence>
        </div>
      </nav>
    </header>
  );
};

export default Header;