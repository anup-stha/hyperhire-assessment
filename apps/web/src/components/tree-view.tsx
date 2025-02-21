"use client";

import { useEffect } from "react";
import { ChevronRight, Plus } from "lucide-react";
import { useDispatch, useSelector } from "react-redux";

import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { RootState, AppDispatch } from "@/store";
import {
  fetchMenus,
  addMenuItem,
  MenuItem,
  setSelectedItem,
} from "@/store/menu/menuSlice";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";

interface TreeItemProps {
  item: MenuItem;
  level?: number;
  isLastChild?: boolean;
}

function TreeItem({ item, level = 0, isLastChild = false }: TreeItemProps) {
  const dispatch = useDispatch<AppDispatch>();
  const hasChildren = item.children && item.children.length > 0;

  const handleAddItem = async () => {
    try {
      await dispatch(
        addMenuItem({ name: "New Item", parentId: item.id })
      ).unwrap();
      dispatch(fetchMenus());
    } catch (error) {
      console.error("Failed to add menu item:", error);
    }
  };

  return (
    <div className="relative">
      {level > 0 && (
        <>
          <div
            className="absolute border-l border-slate-400"
            style={{
              left: `${level * 24}px`,
              height: "100%",
              top: "-16px",
              bottom: isLastChild ? "16px" : "auto",
            }}
          />
          <div
            className="absolute border-t border-slate-400"
            style={{
              left: `${level * 24}px`,
              width: "24px",
              top: "16px",
            }}
          />
        </>
      )}
      <Collapsible>
        <div
          className={cn(
            "group flex items-center cursor-pointer min-h-[32px]",
            "data-[state=open]:bg-muted/50"
          )}
          style={{ paddingLeft: `${level * 24 + 20}px` }}
          onClick={() => dispatch(setSelectedItem(item))}
        >
          <div className="w-full flex items-center gap-2">
            {hasChildren ? (
              <CollapsibleTrigger asChild>
                <button className="h-6 w-6 bg-white z-20 flex items-center justify-center data-[state=open]:rotate-90 transition-transform">
                  <ChevronRight className="h-4 w-4" />
                </button>
              </CollapsibleTrigger>
            ) : (
              <div className="w-6 h-6" />
            )}
            <span className="text-[15px] w-full">{item.name}</span>
            <Button
              variant="ghost"
              size="icon"
              className="h-6 w-6 opacity-0 group-hover:opacity-100 ml-2"
              onClick={(e) => {
                e.stopPropagation();
                handleAddItem();
              }}
            >
              <Plus className="h-4 w-4" />
            </Button>
          </div>
        </div>
        {hasChildren && (
          <CollapsibleContent>
            {item.children.map((child, index) => (
              <TreeItem
                key={child.id}
                item={child}
                level={level + 1}
                isLastChild={index === item.children.length - 1}
              />
            ))}
          </CollapsibleContent>
        )}
      </Collapsible>
    </div>
  );
}

interface TreeViewProps {
  selectedRootId?: string;
  onRootChange: (value: string) => void;
}

export function TreeView({ selectedRootId, onRootChange }: TreeViewProps) {
  const dispatch = useDispatch<AppDispatch>();
  const { items, loading, error } = useSelector(
    (state: RootState) => state.menu
  );

  useEffect(() => {
    dispatch(fetchMenus());
  }, [dispatch]);

  const handleRootChange = (value: string) => {
    onRootChange(value);
    dispatch(setSelectedItem(null));
  };

  if (loading) {
    return <div className="p-4">Loading...</div>;
  }

  if (error) {
    return <div className="p-4 text-red-500">Error: {error}</div>;
  }

  const rootItems = items.filter((item) => item.parentId === null);
  const selectedRoot = selectedRootId
    ? items.find((item) => item.id === selectedRootId)
    : null;
  const filteredItems = selectedRoot ? [selectedRoot] : [];

  return (
    <div className="rounded-lg border bg-card">
      <div className="space-y-4 p-4">
        <div>
          <p className="mb-2 text-sm font-medium">Menu</p>
          <Select value={selectedRootId} onValueChange={handleRootChange}>
            <SelectTrigger className="w-[300px]">
              <SelectValue placeholder="Select menu" />
            </SelectTrigger>
            <SelectContent>
              {rootItems.map((item) => (
                <SelectItem key={item.id} value={item.id}>
                  {item.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div className="min-h-[400px]">
          {filteredItems.map((item) => (
            <TreeItem key={item.id} item={item} />
          ))}
        </div>
      </div>
    </div>
  );
}
