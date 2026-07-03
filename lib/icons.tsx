import { GithubLogo, LinkedinLogo, type Icon } from "@phosphor-icons/react";

const iconMap: Record<string, Icon> = {
  GithubLogo,
  LinkedinLogo,
};

export function getIcon(name: string): Icon | null {
  return iconMap[name] ?? null;
}
