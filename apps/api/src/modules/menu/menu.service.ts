import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../../common/prisma/prisma.service';
import { Menu } from '@prisma/client';

@Injectable()
export class MenuService {
  constructor(private prisma: PrismaService) {}

  // Get all menus
  async getAllMenus(): Promise<Menu[]> {
    return this.prisma.menu.findMany({
      where: { parentId: null }, // Get root menus
      include: {
        children: {
          include: {
            children: true, // Include nested children
          },
        },
      },
    });
  }

  // Get specific menu with depth and root item
  async getMenuById(id: string): Promise<Menu> {
    const menu = await this.prisma.menu.findUnique({
      where: { id },
      include: {
        children: {
          include: {
            children: true,
          },
        },
        parent: true,
      },
    });

    if (!menu) {
      throw new NotFoundException(`Menu with ID ${id} not found`);
    }

    return menu;
  }

  // Add root menu item
  async addRootMenuItem(name: string): Promise<Menu> {
    return this.prisma.menu.create({
      data: {
        name,
        parentId: null,
        depth: 0,
      },
    });
  }

  // Add item hierarchically
  async addMenuItem(name: string, parentId?: string): Promise<Menu> {
    const parent = parentId
      ? await this.prisma.menu.findUnique({
          where: { id: parentId },
          include: { parent: true },
        })
      : null;

    const depth = parent ? parent.depth + 1 : 0;

    return this.prisma.menu.create({
      data: {
        name,
        parentId,
        depth,
      },
    });
  }

  // Update item
  async updateMenuItem(
    id: string,
    name: string,
    parentId?: string | null,
  ): Promise<Menu> {
    const menu = await this.prisma.menu.findUnique({
      where: { id },
    });

    if (!menu) {
      throw new NotFoundException(`Menu with ID ${id} not found`);
    }

    // If parentId is provided and different from current
    if (parentId !== undefined && parentId !== menu.parentId) {
      const parent = parentId
        ? await this.prisma.menu.findUnique({
            where: { id: parentId },
            include: { parent: true },
          })
        : null;

      const depth = parent ? parent.depth + 1 : 0;

      return this.prisma.menu.update({
        where: { id },
        data: {
          name,
          parentId,
          depth,
        },
      });
    }

    // If only name is being updated
    return this.prisma.menu.update({
      where: { id },
      data: { name },
    });
  }

  // Delete item
  async deleteMenuItem(id: string): Promise<Menu> {
    const menu = await this.prisma.menu.findUnique({
      where: { id },
    });

    if (!menu) {
      throw new NotFoundException(`Menu with ID ${id} not found`);
    }

    return this.prisma.menu.delete({
      where: { id },
    });
  }

  // Save menu (this is handled automatically by Prisma)
  async saveMenu(): Promise<void> {
    // No explicit save needed as Prisma handles transactions automatically
    return;
  }
}
