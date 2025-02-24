"use client";

import Link from "next/link";
import { useDispatch, useSelector } from "react-redux";
import { cn } from "@/lib/utils";
import Image from "next/image";
import { RootState } from "@/store";
import { toggleSidebar } from "@/store/sidebar/sidebarSlice";

const Folder = () => {
  return (
    <svg
      width="20"
      height="16"
      viewBox="0 0 20 16"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path
        d="M2 16C1.45 16 0.979167 15.8042 0.5875 15.4125C0.195833 15.0208 0 14.55 0 14V2C0 1.45 0.195833 0.979167 0.5875 0.5875C0.979167 0.195833 1.45 0 2 0H8L10 2H18C18.55 2 19.0208 2.19583 19.4125 2.5875C19.8042 2.97917 20 3.45 20 4V14C20 14.55 19.8042 15.0208 19.4125 15.4125C19.0208 15.8042 18.55 16 18 16H2Z"
        fill="white"
      />
    </svg>
  );
};

const SubMenu = () => {
  return (
    <svg
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <rect
        x="3.65625"
        y="3.66992"
        width="6.69214"
        height="6.69336"
        rx="1"
        stroke="#667085"
      />
      <rect
        x="3.65625"
        y="13.6523"
        width="6.69214"
        height="6.69336"
        rx="1"
        stroke="#667085"
      />
      <rect
        x="13.6539"
        y="13.6523"
        width="6.69214"
        height="6.69336"
        rx="1"
        stroke="#667085"
      />
      <circle cx="16.9871" cy="7.04102" r="3.69067" stroke="#667085" />
    </svg>
  );
};

const SubMenu2 = () => {
  return (
    <svg
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <rect
        x="3.65625"
        y="3.66992"
        width="6.69214"
        height="6.69336"
        rx="1"
        fill="#101828"
      />
      <rect
        x="3.65625"
        y="13.6523"
        width="6.69214"
        height="6.69336"
        rx="1"
        fill="#101828"
      />
      <rect
        x="13.6539"
        y="13.6523"
        width="6.69214"
        height="6.69336"
        rx="1"
        fill="#101828"
      />
      <circle cx="16.9871" cy="7.04102" r="3.69067" fill="#101828" />
    </svg>
  );
};

const OutlineFolder = () => {
  return (
    <svg
      width="20"
      height="16"
      viewBox="0 0 20 16"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path
        d="M2 16C1.45 16 0.979167 15.8042 0.5875 15.4125C0.195833 15.0208 0 14.55 0 14V2C0 1.45 0.195833 0.979167 0.5875 0.5875C0.979167 0.195833 1.45 0 2 0H8L10 2H18C18.55 2 19.0208 2.19583 19.4125 2.5875C19.8042 2.97917 20 3.45 20 4V14C20 14.55 19.8042 15.0208 19.4125 15.4125C19.0208 15.8042 18.55 16 18 16H2ZM2 14H18V4H9.175L7.175 2H2V14Z"
        fill="#475467"
      />
    </svg>
  );
};

const navigation = [
  { name: "Systems", href: "#", icon: Folder, isActive: true },
  { name: "System Code", href: "#", icon: SubMenu },
  { name: "Properties", href: "#", icon: SubMenu },
  { name: "Menus", href: "#", icon: SubMenu2, current: true },
  { name: "API List", href: "#", icon: SubMenu },
  { name: "Users & Group", href: "#", icon: OutlineFolder },
  { name: "Competition", href: "#", icon: OutlineFolder },
];

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

export const SidebarToggleIcon = () => {
  return (
    <svg
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path
        d="M3 18V16H16V18H3ZM19.6 17L14.6 12L19.6 7L21 8.4L17.4 12L21 15.6L19.6 17ZM3 13V11H13V13H3ZM3 8V6H16V8H3Z"
        fill="white"
      />
    </svg>
  );
};
