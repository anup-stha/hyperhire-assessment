import { Folder, SubMenu, SubMenu2, OutlineFolder } from "@/components/icons";

export interface NavigationItem {
  name: string;
  href: string;
  icon: () => React.ReactNode;
  isActive?: boolean;
  current?: boolean;
}

export const navigation: NavigationItem[] = [
  { name: "Systems", href: "#", icon: Folder, isActive: true },
  { name: "System Code", href: "#", icon: SubMenu },
  { name: "Properties", href: "#", icon: SubMenu },
  { name: "Menus", href: "#", icon: SubMenu2, current: true },
  { name: "API List", href: "#", icon: SubMenu },
  { name: "Users & Group", href: "#", icon: OutlineFolder },
  { name: "Competition", href: "#", icon: OutlineFolder },
];
