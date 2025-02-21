"use client";

import { useState, useEffect } from "react";
import { Grid3x3, Plus } from "lucide-react";

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
} from "@/store/menu/menuSlice";

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
    const traverse = (items: any[], depth = 0) => {
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
          name: "New Root Menu",
          parentId: undefined, // No parent for root menu
        })
      ).unwrap();
      // Refresh menus after adding
      dispatch(fetchMenus());
    } catch (error) {
      console.error("Failed to add root menu:", error);
    }
  };

  const renderForm = () => {
    if (!selectedItem) {
      return (
        <div className="space-y-6 rounded-lg border bg-muted/50 p-4">
          <p className="text-sm text-muted-foreground mb-4">
            Select a menu item to edit or create a root menu
          </p>
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
      );
    }

    return (
      <div className="space-y-6 rounded-lg border bg-muted/50 p-4">
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
    <div className="flex gap-4">
      <div className="min-h-[500px]">
        <TreeView
          selectedRootId={selectedRootId}
          onRootChange={setSelectedRootId}
        />
      </div>
      <div>{renderForm()}</div>
    </div>
  );
}
