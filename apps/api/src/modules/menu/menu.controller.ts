import {
  Controller,
  Get,
  Post,
  Put,
  Delete,
  Body,
  Param,
} from '@nestjs/common';
import { MenuService } from './menu.service';
import { Menu } from '@prisma/client';

@Controller('menus')
export class MenuController {
  constructor(private readonly menuService: MenuService) {}

  @Get()
  async getAllMenus(): Promise<Menu[]> {
    return this.menuService.getAllMenus();
  }

  @Get(':id')
  async getMenuById(@Param('id') id: string): Promise<Menu> {
    return this.menuService.getMenuById(id);
  }

  @Post('root')
  async addRootMenuItem(@Body() data: { name: string }): Promise<Menu> {
    return this.menuService.addRootMenuItem(data.name);
  }

  @Post()
  async addMenuItem(
    @Body() data: { name: string; parentId?: string },
  ): Promise<Menu> {
    return this.menuService.addMenuItem(data.name, data.parentId);
  }

  @Put(':id')
  async updateMenuItem(
    @Param('id') id: string,
    @Body() data: { name: string; parentId?: string | null },
  ): Promise<Menu> {
    return this.menuService.updateMenuItem(id, data.name, data.parentId);
  }

  @Delete(':id')
  async deleteMenuItem(@Param('id') id: string): Promise<Menu> {
    return this.menuService.deleteMenuItem(id);
  }

  @Post('save')
  async saveMenu(): Promise<void> {
    return this.menuService.saveMenu();
  }
}
