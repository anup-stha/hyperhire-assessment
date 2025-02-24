"use client";

import { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { RootState, AppDispatch } from "@/store";
import {
  updateMenuItem,
  addMenuItem,
  fetchMenus,
  MenuItem,
} from "@/store/menu/menuSlice";
import { toggleSidebar } from "@/store/sidebar/sidebarSlice";
import { TreeView } from "@/components/tree-view";
import { MenuForm } from "./menu-form";
import { SidebarOpen, MenuFolder, MenuIcon } from "@/components/icons";

export function MenuContents() {
  const dispatch = useDispatch<AppDispatch>();
  const selectedItem = useSelector(
    (state: RootState) => state.menu.selectedItem
  );
  const items = useSelector((state: RootState) => state.menu.items);
  const [selectedRootId, setSelectedRootId] = useState<string | undefined>();

  const [formData, setFormData] = useState({
    name: "",
    depth: 0,
    parentId: "",
  });

  useEffect(() => {
    // Fetch menus when component mounts
    dispatch(fetchMenus());
  }, [dispatch]);

  // Set default root menu when items are loaded
  useEffect(() => {
    if (items.length > 0 && !selectedRootId) {
      const rootItems = items.filter((item) => item.parentId === null);
      if (rootItems.length > 0) {
        setSelectedRootId(rootItems[0].id);
      }
    }
  }, [items, selectedRootId]);

  useEffect(() => {
    if (selectedItem) {
      setFormData({
        name: selectedItem.name,
        depth: selectedItem.depth,
        parentId: selectedItem.parentId || "null",
      });
    }
  }, [selectedItem]);

  // Function to get all possible parent items
  const getParentOptions = () => {
    const options: { id: string; name: string }[] = [];
    const traverse = (items: MenuItem[], depth = 0) => {
      items.forEach((item) => {
        if (item.id !== selectedItem?.id) {
          // Prevent item from being its own parent
          options.push({ id: item.id, name: item.name });
        }
        if (item.children) {
          traverse(item.children, depth + 1);
        }
      });
    };
    traverse(items);
    return options;
  };

  const handleSave = async () => {
    if (!selectedItem) return;
    try {
      await dispatch(
        updateMenuItem({
          id: selectedItem.id,
          name: formData.name,
          parentId: formData.parentId === "null" ? null : formData.parentId,
        })
      ).unwrap();
      // Refresh menus after update
      dispatch(fetchMenus());
    } catch (error) {
      console.error("Failed to update menu item:", error);
    }
  };

  const handleAddRoot = async () => {
    try {
      await dispatch(
        addMenuItem({
          name: formData.name || "New Root Menu",
          parentId: undefined,
        })
      ).unwrap();
      // Reset form data after adding
      setFormData({ name: "", depth: 0, parentId: "" });
      // Refresh menus after adding
      dispatch(fetchMenus());
    } catch (error) {
      console.error("Failed to add root menu:", error);
    }
  };

  return (
    <div className="p-6 flex flex-col gap-8">
      <div className="flex flex-col gap-8">
        <button
          onClick={() => dispatch(toggleSidebar())}
          className="lg:hidden block"
        >
          <SidebarOpen />
        </button>
        <div className="flex items-center gap-1">
          <MenuFolder />
          <span className="text-slate-300">/</span>
          <h1 className="text-sm font-medium text-slate-700">Menus</h1>
        </div>
      </div>

      <div className="flex items-center gap-2">
        <MenuIcon />
        <h1 className="text-3xl text-slate-900 font-semibold">Menus</h1>
      </div>
      <div className="flex flex-col lg:flex-row gap-6">
        <div className="h-full">
          <TreeView
            selectedRootId={selectedRootId}
            onRootChange={setSelectedRootId}
          />
        </div>
        <MenuForm
          selectedItem={selectedItem}
          formData={formData}
          onFormDataChange={setFormData}
          onSave={handleSave}
          onAddRoot={handleAddRoot}
          parentOptions={getParentOptions()}
        />
      </div>
    </div>
  );
}
