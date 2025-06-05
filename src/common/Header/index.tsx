import { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";
import { AnimatePresence } from "framer-motion";
import { BsMoonStarsFill, BsBookmark } from "react-icons/bs";
import { AiOutlineMenu } from "react-icons/ai";
import { FiSun, FiSettings } from "react-icons/fi";
import throttle from "lodash.throttle";

import { ThemeMenu, Logo, SearchBar } from "..";
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

        <div className="hidden md:flex items-center max-w-md w-full mx-4">
          <SearchBar />
        </div>

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
            <BsBookmark className="w-5 h-5" />
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

export default Header;