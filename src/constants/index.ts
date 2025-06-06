import { FiSun, FiSearch, FiSave, FiSettings } from "react-icons/fi";
import { BsMoonStarsFill } from "react-icons/bs";
import { GoDeviceDesktop } from "react-icons/go";
import { AiOutlineHome } from "react-icons/ai";
import { TbMovie } from "react-icons/tb";
import { MdOutlineLiveTv } from "react-icons/md";
import { BsCalendar3 } from "react-icons/bs";

import { ITheme, INavLink } from "../types";

export const navLinks: INavLink[] = [
  {
    title: "home",
    path: "/",
    icon: AiOutlineHome,
  },
  {
    title: "movies",
    path: "/movie",
    icon: TbMovie,
  },
  {
    title: "series",
    path: "/tv",
    icon: MdOutlineLiveTv,
  },
  {
    title: "calendar",
    path: "/calendar",
    icon: BsCalendar3,
  },
];

export const themeOptions: ITheme[] = [
  {
    title: "Dark",
    icon: BsMoonStarsFill,
  },
  {
    title: "Light",
    icon: FiSun,
  },
  {
    title: "System",
    icon: GoDeviceDesktop,
  },
];

export const footerLinks = [
  "home",
  "live",
  "you must watch",
  "contact us",
  "FAQ",
  "Recent release",
  "term of services",
  "premium",
  "Top IMDB",
  "About us",
  "Privacy policy",
];

export const sections = [
  {
    title: "Trending movies",
    category: "movie",
    type: "popular",
  },
  {
    title: "Top rated movies",
    category: "movie",
    type: "top_rated",
  },
  {
    title: "Trending series",
    category: "tv",
    type: "popular",
  },
  {
    title: "Top rated series",
    category: "tv",
    type: "top_rated",
  },
];