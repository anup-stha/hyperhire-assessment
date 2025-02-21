import Link from "next/link";
import {
  BarChart2,
  Code2,
  Grid3x3,
  GridIcon,
  LayersIcon,
  Menu,
  Trophy,
  Users2,
} from "lucide-react";

import { cn } from "@/lib/utils";

const navigation = [
  { name: "Systems", href: "#", icon: LayersIcon },
  { name: "System Code", href: "#", icon: Code2 },
  { name: "Properties", href: "#", icon: Grid3x3 },
  { name: "Menus", href: "#", icon: Menu, current: true },
  { name: "API List", href: "#", icon: BarChart2 },
  { name: "Users & Group", href: "#", icon: Users2 },
  { name: "Competition", href: "#", icon: Trophy },
];

export function Sidebar() {
  return (
    <div className="flex w-60 flex-col bg-slate-900 rounded-xl">
      <div className="flex h-16 items-center gap-2 px-4">
        <GridIcon className="h-6 w-6 text-white" />
        <span className="text-xl font-bold text-white">CLOIT</span>
      </div>
      <nav className="flex-1 space-y-1 px-2 py-4">
        {navigation.map((item) => {
          const Icon = item.icon;
          return (
            <Link
              key={item.name}
              href={item.href}
              className={cn(
                "group flex items-center gap-3 rounded-md px-3 py-2 text-sm font-medium",
                item.current
                  ? "bg-lime-400 text-slate-900"
                  : "text-slate-300 hover:bg-slate-800 hover:text-white"
              )}
            >
              <Icon className="h-5 w-5 flex-shrink-0" />
              {item.name}
            </Link>
          );
        })}
      </nav>
    </div>
  );
}
