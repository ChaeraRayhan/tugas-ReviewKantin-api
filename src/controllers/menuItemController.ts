import type { Request, Response } from "express";
import { MenuItemService } from "../services/menuItemService.ts";
import { getValidated } from "../middlewares/validate.ts";
import type { IdParam } from "../schemas/commonSchema.ts";
import type {
  CreateMenuItemInput,
  UpdateMenuItemInput,
} from "../schemas/menuitemschema.ts";

export class MenuItemController {
  private menuItemService: MenuItemService;

  constructor(menuItemService: MenuItemService = new MenuItemService()) {
    this.menuItemService = menuItemService;
  }

  getMenuItems = async (_req: Request, res: Response): Promise<void> => {
    const data = await this.menuItemService.getAllMenuItems();
    res.status(200).json({ status: "success", data });
  };

  getMenuItemById = async (_req: Request, res: Response): Promise<void> => {
    const { id } = getValidated<IdParam>(res, "params");
    const menu = await this.menuItemService.getMenuItemById(id);
    res.status(200).json({ status: "success", data: menu });
  };

  createMenuItem = async (_req: Request, res: Response): Promise<void> => {
    const body = getValidated<CreateMenuItemInput>(res, "body");
    const menu = await this.menuItemService.createMenuItem(body);
    res.status(201).json({ status: "success", data: menu });
  };

  updateMenuItem = async (_req: Request, res: Response): Promise<void> => {
    const { id } = getValidated<IdParam>(res, "params");
    const body = getValidated<UpdateMenuItemInput>(res, "body");
    const menu = await this.menuItemService.updateMenuItem(id, body);
    res.status(200).json({ status: "success", data: menu });
  };

  deleteMenuItem = async (_req: Request, res: Response): Promise<void> => {
    const { id } = getValidated<IdParam>(res, "params");
    const menu = await this.menuItemService.deleteMenuItem(id);
    res.status(200).json({ status: "success", data: menu });
  };
}