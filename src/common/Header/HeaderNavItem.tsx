import { NavLink } from "react-router-dom";
import { textColor } from "../../styles";
import { cn } from "../../utils/helper";

interface HeaderProps {
  link: { title: string; path: string };
  isNotFoundPage: boolean;
  showBg: boolean;
}

const HeaderNavItem = ({ link, showBg, isNotFoundPage }: HeaderProps) => {
  return (
    <li>
      <NavLink
        to={link.path}
        className={({ isActive }) => {
          return cn(
            "nav-link relative px-3 py-2 font-medium transition-all duration-200",
            isActive
              ? cn(
                  showBg ? textColor : "text-secColor",
                  "after:bg-current"
                )
              : cn(
                  isNotFoundPage || showBg
                    ? "text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white"
                    : "text-gray-300 hover:text-white",
                  "after:bg-current"
                )
          );
        }}
        end
      >
        {link.title}
      </NavLink>
    </li>
  );
};

export default HeaderNavItem;