import { faHouse, faUser, faGear } from "@fortawesome/free-solid-svg-icons";
import { faHeart } from "@fortawesome/free-regular-svg-icons";
import { faGithub } from "@fortawesome/free-brands-svg-icons";

export const ICONS = {
  home: faHouse,
  user: faUser,
  settings: faGear,
  heartOutline: faHeart,
  github: faGithub,
} as const;

export type IconName = keyof typeof ICONS;
