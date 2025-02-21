import { Sidebar } from "@/components/sidebar";
import { MenuContents } from "@/components/menu-contents";

export default function Page() {
  return (
    <div className="flex h-screen bg-background p-4 gap-4">
      <Sidebar />
      <main className="flex-1 overflow-auto">
        <MenuContents />
      </main>
    </div>
  );
}
