import {
  FaHouse,
  FaUser,
  FaGear,
  FaRegHeart,
  FaHeart,
  FaGithub,
  FaMagnifyingGlass,
  FaBagShopping,
  FaBars,
  FaXmark,
  FaInstagram,
  FaWhatsapp,
} from "react-icons/fa6";
import type {IconComponent} from "./icon";

export const ICONS = {
  home: FaHouse,
  user: FaUser,
  settings: FaGear,
  heartOutline: FaRegHeart,
  heart: FaHeart,
  github: FaGithub,
  search: FaMagnifyingGlass,
  cart: FaBagShopping,
  menu: FaBars,
  close: FaXmark,
  instagram: FaInstagram,
  whatsapp: FaWhatsapp,
} as const satisfies Record<string, IconComponent>;

export type IconName = keyof typeof ICONS;
