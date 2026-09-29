import { MenuItemRepository } from "../repositories/menuItemRepository.ts";
import type { MenuItemDto } from "../dtos/stallDto.ts";
import type { MenuItemDetailDto } from "../dtos/menuItemDto.ts";
import { AppError } from "../errors/AppError.ts";
import { NotFoundError } from "../errors/NotFoundError.ts";
import type {
  CreateMenuItemInput,
  UpdateMenuItemInput,
} from "../schemas/menuitemschema.ts";
import type { menuItems } from "../db/schema.ts";

type MenuRow = typeof menuItems.$inferSelect;
type StallSummary = MenuItemDetailDto["stall"];

export class MenuItemService {
  private menuItemRepository: MenuItemRepository;

  constructor(
    menuItemRepository: MenuItemRepository = new MenuItemRepository(),
  ) {
    this.menuItemRepository = menuItemRepository;
  }

  private toDto(row: MenuRow): MenuItemDto {
    return {
      id: row.id,
      stallId: row.stallId,
      name: row.name,
      price: row.price,
      isAvailable: row.isAvailable,
    };
  }

  // Row hasil JOIN -> DTO detail (menu + ringkasan warung).
  private toDetailDto(row: { menu: MenuRow; stall: StallSummary }): MenuItemDetailDto {
    return { ...this.toDto(row.menu), stall: row.stall };
  }

  async getAllMenuItems(): Promise<MenuItemDetailDto[]> {
    const rows = await this.menuItemRepository.findAllWithStall();
    return rows.map((row) => this.toDetailDto(row));
  }

  async getMenuItemById(id: number): Promise<MenuItemDetailDto> {
    const row = await this.menuItemRepository.findByIdWithStall(id);
    if (!row) throw new NotFoundError("Menu tidak ditemukan");
    return this.toDetailDto(row);
  }

  async createMenuItem(input: CreateMenuItemInput): Promise<MenuItemDto> {
    const row = await this.menuItemRepository.create(input);
    if (!row) throw new AppError(500, "Menu gagal dibuat");
    return this.toDto(row);
  }

  async updateMenuItem(
    id: number,
    input: UpdateMenuItemInput,
  ): Promise<MenuItemDto> {
    const row = await this.menuItemRepository.update(id, input);
    if (!row) throw new NotFoundError("Menu tidak ditemukan");
    return this.toDto(row);
  }

  async deleteMenuItem(id: number): Promise<MenuItemDto> {
    const row = await this.menuItemRepository.remove(id);
    if (!row) throw new NotFoundError("Menu tidak ditemukan");
    return this.toDto(row);
  }
}