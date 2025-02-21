import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import type { PayloadAction } from "@reduxjs/toolkit";

export interface MenuItem {
  id: string;
  name: string;
  depth: number;
  parentId: string | null;
  children: MenuItem[];
  createdAt: string;
  updatedAt: string;
}

interface MenuState {
  items: MenuItem[];
  selectedItem: MenuItem | null;
  loading: boolean;
  error: string | null;
}

const initialState: MenuState = {
  items: [],
  selectedItem: null,
  loading: false,
  error: null,
};

const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:4000";

// Async thunks
export const fetchMenus = createAsyncThunk("menu/fetchMenus", async () => {
  try {
    const response = await fetch(`${API_URL}/menus`);
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    return response.json();
  } catch (error: unknown) {
    if (error instanceof Error) {
      throw new Error(`Failed to fetch menus: ${error.message}`);
    }
    throw new Error("Failed to fetch menus");
  }
});

export const addRootMenuItem = createAsyncThunk(
  "menu/addRootMenuItem",
  async (name: string) => {
    try {
      const response = await fetch(`${API_URL}/menus/root`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name }),
      });
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      return response.json();
    } catch (error: unknown) {
      if (error instanceof Error) {
        throw new Error(`Failed to add root menu item: ${error.message}`);
      }
      throw new Error("Failed to add root menu item");
    }
  }
);

export const addMenuItem = createAsyncThunk(
  "menu/addMenuItem",
  async ({ name, parentId }: { name: string; parentId?: string }) => {
    try {
      const response = await fetch(`${API_URL}/menus`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, parentId }),
      });
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      return response.json();
    } catch (error: unknown) {
      if (error instanceof Error) {
        throw new Error(`Failed to add menu item: ${error.message}`);
      }
      throw new Error("Failed to add menu item");
    }
  }
);

export const updateMenuItem = createAsyncThunk(
  "menu/updateMenuItem",
  async ({
    id,
    name,
    parentId,
  }: {
    id: string;
    name: string;
    parentId?: string | null;
  }) => {
    try {
      const response = await fetch(`${API_URL}/menus/${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, parentId }),
      });
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      return response.json();
    } catch (error: unknown) {
      if (error instanceof Error) {
        throw new Error(`Failed to update menu item: ${error.message}`);
      }
      throw new Error("Failed to update menu item");
    }
  }
);

export const deleteMenuItem = createAsyncThunk(
  "menu/deleteMenuItem",
  async (id: string) => {
    try {
      const response = await fetch(`${API_URL}/menus/${id}`, {
        method: "DELETE",
      });
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      return id;
    } catch (error: unknown) {
      if (error instanceof Error) {
        throw new Error(`Failed to delete menu item: ${error.message}`);
      }
      throw new Error("Failed to delete menu item");
    }
  }
);

export const menuSlice = createSlice({
  name: "menu",
  initialState,
  reducers: {
    setSelectedItem: (state, action: PayloadAction<MenuItem | null>) => {
      state.selectedItem = action.payload;
    },
  },
  extraReducers: (builder) => {
    builder
      // Fetch menus
      .addCase(fetchMenus.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchMenus.fulfilled, (state, action) => {
        state.loading = false;
        state.items = action.payload;
      })
      .addCase(fetchMenus.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || "Failed to fetch menus";
      })
      // Add root menu item
      .addCase(addRootMenuItem.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(addRootMenuItem.fulfilled, (state, action) => {
        state.loading = false;
        state.items.push(action.payload);
      })
      .addCase(addRootMenuItem.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || "Failed to add root menu item";
      })
      // Add menu item
      .addCase(addMenuItem.fulfilled, (state, action) => {
        if (action.payload.parentId) {
          const updateChildren = (items: MenuItem[]): MenuItem[] => {
            return items.map((item) => {
              if (item.id === action.payload.parentId) {
                return {
                  ...item,
                  children: [...(item.children || []), action.payload],
                };
              }
              if (item.children) {
                return {
                  ...item,
                  children: updateChildren(item.children),
                };
              }
              return item;
            });
          };
          state.items = updateChildren(state.items);
        } else {
          state.items.push(action.payload);
        }
      })
      // Update menu item
      .addCase(updateMenuItem.fulfilled, (state, action) => {
        const updateItem = (items: MenuItem[]): MenuItem[] => {
          return items.map((item) => {
            if (item.id === action.payload.id) {
              return { ...item, ...action.payload };
            }
            if (item.children) {
              return {
                ...item,
                children: updateItem(item.children),
              };
            }
            return item;
          });
        };
        state.items = updateItem(state.items);
      })
      // Delete menu item
      .addCase(deleteMenuItem.fulfilled, (state, action) => {
        const removeItem = (items: MenuItem[]): MenuItem[] => {
          return items.filter((item) => {
            if (item.id === action.payload) return false;
            if (item.children) {
              item.children = removeItem(item.children);
            }
            return true;
          });
        };
        state.items = removeItem(state.items);
      });
  },
});

export const { setSelectedItem } = menuSlice.actions;
export default menuSlice.reducer;
