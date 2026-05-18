import {
  FontAwesomeIcon,
  type FontAwesomeIconProps,
} from "@fortawesome/react-fontawesome";

export type IconProps = Omit<FontAwesomeIconProps, "icon"> & {
  icon: FontAwesomeIconProps["icon"];
};

export function Icon({ icon, ...rest }: IconProps) {
  return <FontAwesomeIcon icon={icon} {...rest} />;
}
