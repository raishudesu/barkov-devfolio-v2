import { GithubLogo, LinkedinLogo, Link, type Icon } from "@phosphor-icons/react";

const iconMap: Record<string, Icon> = {
  GithubLogo,
  LinkedinLogo,
  Link,
};

export function getIcon(name: string): Icon | null {
  return iconMap[name] ?? null;
}
