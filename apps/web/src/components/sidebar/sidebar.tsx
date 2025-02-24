"use client";

import Link from "next/link";
import { useDispatch, useSelector } from "react-redux";
import { cn } from "@/lib/utils";
import Image from "next/image";
import { RootState } from "@/store";
import { toggleSidebar } from "@/store/sidebar/sidebarSlice";
import { navigation } from "@/config/navigation";
import { SidebarToggleIcon } from "@/components/icons";

export function Sidebar() {
  const dispatch = useDispatch();
  const isCollapsed = useSelector(
    (state: RootState) => state.sidebar.isCollapsed
  );

  return (
    <div
      className={cn(
        "flex flex-col bg-slate-900 rounded-xl p-2 gap-4 h-full transition-all duration-300",
        isCollapsed ? "w-16" : "w-60"
      )}
    >
      <div className="flex items-center justify-between gap-2 py-4 px-2">
        <div
          className={cn(
            "h-6 relative transition-all duration-300",
            isCollapsed ? "w-6" : "w-[70px]"
          )}
        >
          <Image src="/logo.svg" alt="CLOIT" fill className="object-contain" />
        </div>
        <button
          onClick={() => dispatch(toggleSidebar())}
          className="hover:bg-slate-800 rounded-lg p-1 transition-colors"
        >
          <SidebarToggleIcon />
        </button>
      </div>
      <nav
        className={cn(
          "space-y-1 bg-slate-800 h-fit rounded-xl py-2",
          isCollapsed && "px-0"
        )}
      >
        {navigation.slice(0, 5).map((item) => {
          const Icon = item.icon;
          return (
            <Link
              key={item.name}
              href={item.href}
              className={cn(
                "group flex items-center h-11 rounded-xl text-sm font-medium transition-all",
                isCollapsed ? "justify-center px-2" : "gap-3 px-3",
                item.isActive
                  ? "text-white"
                  : "text-slate-500 hover:bg-slate-800 hover:text-slate-200",
                item.current &&
                  "bg-lime-400 text-slate-900 hover:bg-lime-500 hover:text-slate-900"
              )}
              title={isCollapsed ? item.name : undefined}
            >
              <div
                className={cn(
                  "flex items-center justify-center",
                  isCollapsed && "scale-125"
                )}
              >
                <Icon />
              </div>
              {!isCollapsed && item.name}
            </Link>
          );
        })}
      </nav>
      <nav className={cn("space-y-1 h-fit rounded-xl", isCollapsed && "px-0")}>
        {navigation.slice(5, 7).map((item) => {
          const Icon = item.icon;
          return (
            <Link
              key={item.name}
              href={item.href}
              className={cn(
                "group flex items-center h-11 rounded-xl text-sm font-medium transition-all",
                isCollapsed ? "justify-center px-2" : "gap-3 px-3",
                item.isActive
                  ? "text-white"
                  : "text-slate-500 hover:bg-slate-800 hover:text-slate-200",
                item.current && "bg-lime-400 text-slate-900"
              )}
              title={isCollapsed ? item.name : undefined}
            >
              <div
                className={cn(
                  "flex items-center justify-center",
                  isCollapsed && "scale-125"
                )}
              >
                <Icon />
              </div>
              {!isCollapsed && item.name}
            </Link>
          );
        })}
      </nav>
    </div>
  );
}
