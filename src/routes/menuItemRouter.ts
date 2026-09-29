import { Router } from "express";
import { MenuItemController } from "../controllers/menuItemController.ts";
import { validate } from "../middlewares/validate.ts";
import { idParamSchema } from "../schemas/commonSchema.ts";
import {
  createMenuItemSchema,
  updateMenuItemSchema,
} from "../schemas/menuitemschema.ts";

const menuItemRouter = Router();
const menuItemController = new MenuItemController();

menuItemRouter.get("/", menuItemController.getMenuItems);
menuItemRouter.post(
  "/",
  validate(createMenuItemSchema, "body"),
  menuItemController.createMenuItem,
);
menuItemRouter.get(
  "/:id",
  validate(idParamSchema, "params"),
  menuItemController.getMenuItemById,
);
menuItemRouter.put(
  "/:id",
  validate(idParamSchema, "params"),
  validate(updateMenuItemSchema, "body"),
  menuItemController.updateMenuItem,
);
menuItemRouter.delete(
  "/:id",
  validate(idParamSchema, "params"),
  menuItemController.deleteMenuItem,
);

export { menuItemRouter };