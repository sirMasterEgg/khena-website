import type {IconType, IconBaseProps} from "react-icons";

export type IconComponent = IconType;

export type IconProps = IconBaseProps & {
  icon: IconType;
};

export function Icon({icon: IconImpl, ...rest}: IconProps) {
  return <IconImpl {...rest} />;
}
