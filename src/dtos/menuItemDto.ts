import type { MenuItemDto } from "./stallDto.ts";

// Hasil JOIN MENU_ITEMS -> STALLS.
export interface MenuItemDetailDto extends MenuItemDto {
  stall: {
    id: number;
    name: string;
    category: string | null;
    location: string | null;
  };
}