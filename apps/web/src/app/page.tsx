"use client";

import { Sidebar } from "@/components/sidebar";
import { MenuContents } from "@/components/menu";
import { useSelector } from "react-redux";
import { RootState } from "@/store";
import { cn } from "@/lib/utils";

export default function Page() {
  const isCollapsed = useSelector(
    (state: RootState) => state.sidebar.isCollapsed
  );

  return (
    <div className="flex h-screen bg-background p-4 gap-4">
      {/* Desktop Sidebar */}
      <div className="hidden lg:block">
        <Sidebar />
      </div>

      {/* Mobile Sidebar Overlay */}
      <div
        className={cn(
          "fixed inset-0 bg-black/50 lg:hidden z-40 transition-opacity",
          isCollapsed ? "opacity-0 pointer-events-none" : "opacity-100"
        )}
      >
        <div
          className={cn(
            "absolute left-0 top-0 h-full transition-transform",
            isCollapsed ? "-translate-x-full" : "translate-x-0"
          )}
        >
          <Sidebar />
        </div>
      </div>

      <main className="flex-1 overflow-auto">
        <MenuContents />
      </main>
    </div>
  );
}
