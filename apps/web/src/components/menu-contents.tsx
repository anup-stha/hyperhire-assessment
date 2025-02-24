"use client";

import { useState, useEffect } from "react";
import { Plus } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { TreeView } from "./tree-view";
import { useDispatch, useSelector } from "react-redux";
import { RootState, AppDispatch } from "@/store";
import {
  updateMenuItem,
  addMenuItem,
  fetchMenus,
  MenuItem,
} from "@/store/menu/menuSlice";
import { toggleSidebar } from "@/store/sidebar/sidebarSlice";

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

  const renderForm = () => {
    if (!selectedItem) {
      return (
        <div className="space-y-6 rounded-lg border bg-muted/50 p-4 lg:min-w-[400px] max-w-[400px]">
          <p className="text-sm text-muted-foreground mb-4">
            Select a menu item to edit or create a root menu
          </p>

          <div className="space-y-4">
            <div>
              <label className="text-sm font-medium" htmlFor="rootMenuName">
                Root Menu Name
              </label>
              <Input
                id="rootMenuName"
                className="mt-1"
                placeholder="Enter root menu name"
                value={formData.name}
                onChange={(e) =>
                  setFormData({ ...formData, name: e.target.value })
                }
              />
            </div>

            <Button
              className="w-full"
              size="lg"
              onClick={handleAddRoot}
              variant="outline"
            >
              <Plus className="h-4 w-4 mr-2" />
              Add Root Menu
            </Button>
          </div>
        </div>
      );
    }

    return (
      <div className="space-y-6 rounded-lg border bg-muted/50 p-4 w-[400px]">
        <div>
          <label className="text-sm font-medium" htmlFor="menuId">
            Menu ID
          </label>
          <Input
            id="menuId"
            className="mt-1"
            value={selectedItem.id}
            disabled
          />
        </div>
        <div>
          <label className="text-sm font-medium" htmlFor="depth">
            Depth
          </label>
          <Input
            id="depth"
            className="mt-1"
            type="number"
            value={formData.depth}
            onChange={(e) =>
              setFormData({ ...formData, depth: parseInt(e.target.value) })
            }
          />
        </div>
        <div>
          <label className="text-sm font-medium" htmlFor="parentId">
            Parent Data
          </label>
          <Select
            value={formData.parentId}
            onValueChange={(value) =>
              setFormData({ ...formData, parentId: value })
            }
          >
            <SelectTrigger className="mt-1">
              <SelectValue placeholder="Select parent" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="null">None</SelectItem>
              {getParentOptions().map((option) => (
                <SelectItem key={option.id} value={option.id}>
                  {option.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        <div>
          <label className="text-sm font-medium" htmlFor="name">
            Name
          </label>
          <Input
            id="name"
            className="mt-1"
            value={formData.name}
            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
          />
        </div>
        <Button className="w-full" size="lg" onClick={handleSave}>
          Save
        </Button>
      </div>
    );
  };

  return (
    <div className="p-6 flex flex-col gap-8">
      <div className="flex flex-col  gap-8">
        <button
          onClick={() => dispatch(toggleSidebar())}
          className="lg:hidden block"
        >
          <SidebarOpen />
        </button>
        <div className="flex items-center gap-1">
          <Folder />
          <span className="text-slate-300">/</span>
          <h1 className="text-sm font-medium text-slate-700">Menus</h1>
        </div>
      </div>

      <div className="flex items-center gap-2">
        <Icon />
        <h1 className="text-3xl text-slate-900 font-semibold">Menus</h1>
      </div>
      <div className="flex flex-col lg:flex-row gap-6">
        <div className="h-full">
          <TreeView
            selectedRootId={selectedRootId}
            onRootChange={setSelectedRootId}
          />
        </div>
        <div>{renderForm()}</div>
      </div>
    </div>
  );
}

const SidebarOpen = () => {
  return (
    <svg
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path
        d="M4 7H12.5M4 12H14.5M4 17H12.5"
        stroke="black"
        stroke-linecap="round"
        stroke-linejoin="round"
      />
      <path
        d="M16.5 8.5L20 12L16.5 15.5"
        stroke="black"
        stroke-linecap="round"
        stroke-linejoin="round"
      />
    </svg>
  );
};

const Folder = () => {
  return (
    <svg
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path
        d="M22 19C22 19.5304 21.7893 20.0391 21.4142 20.4142C21.0391 20.7893 20.5304 21 20 21H4C3.46957 21 2.96086 20.7893 2.58579 20.4142C2.21071 20.0391 2 19.5304 2 19V5C2 4.46957 2.21071 3.96086 2.58579 3.58579C2.96086 3.21071 3.46957 3 4 3H9L11 6H20C20.5304 6 21.0391 6.21071 21.4142 6.58579C21.7893 6.96086 22 7.46957 22 8V19Z"
        fill="#D0D5DD"
      />
    </svg>
  );
};

const Icon = () => {
  return (
    <svg
      width="52"
      height="52"
      viewBox="0 0 52 52"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <circle cx="26" cy="26" r="26" fill="#253BFF" />
      <rect
        x="17.6562"
        y="17.6699"
        width="6.69214"
        height="6.69336"
        rx="1"
        fill="white"
      />
      <rect
        x="17.6562"
        y="27.6523"
        width="6.69214"
        height="6.69336"
        rx="1"
        fill="white"
      />
      <rect
        x="27.6539"
        y="27.6523"
        width="6.69214"
        height="6.69336"
        rx="1"
        fill="white"
      />
      <circle cx="30.9871" cy="21.041" r="3.69067" fill="white" />
    </svg>
  );
};
