import {
  FaHouse,
  FaUser,
  FaGear,
  FaRegHeart,
  FaGithub,
} from "react-icons/fa6";
import type {IconComponent} from "./icon";

export const ICONS = {
  home: FaHouse,
  user: FaUser,
  settings: FaGear,
  heartOutline: FaRegHeart,
  github: FaGithub,
} as const satisfies Record<string, IconComponent>;

export type IconName = keyof typeof ICONS;
