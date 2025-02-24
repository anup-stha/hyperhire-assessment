"use client";

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
import { MenuItem } from "@/store/menu/menuSlice";

interface MenuFormProps {
  selectedItem: MenuItem | null;
  formData: {
    name: string;
    depth: number;
    parentId: string;
  };
  onFormDataChange: (data: {
    name: string;
    depth: number;
    parentId: string;
  }) => void;
  onSave: () => void;
  onAddRoot: () => void;
  parentOptions: { id: string; name: string }[];
}

export function MenuForm({
  selectedItem,
  formData,
  onFormDataChange,
  onSave,
  onAddRoot,
  parentOptions,
}: MenuFormProps) {
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
                onFormDataChange({ ...formData, name: e.target.value })
              }
            />
          </div>

          <Button
            className="w-full"
            size="lg"
            onClick={onAddRoot}
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
        <Input id="menuId" className="mt-1" value={selectedItem.id} disabled />
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
            onFormDataChange({ ...formData, depth: parseInt(e.target.value) })
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
            onFormDataChange({ ...formData, parentId: value })
          }
        >
          <SelectTrigger className="mt-1">
            <SelectValue placeholder="Select parent" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="null">None</SelectItem>
            {parentOptions.map((option) => (
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
          onChange={(e) =>
            onFormDataChange({ ...formData, name: e.target.value })
          }
        />
      </div>
      <Button className="w-full" size="lg" onClick={onSave}>
        Save
      </Button>
    </div>
  );
}
