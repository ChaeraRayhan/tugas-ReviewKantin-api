import { Router } from "express";
import { FlagController } from "../controllers/flagController.ts";
import { validate } from "../middlewares/validate.ts";
import { idParamSchema } from "../schemas/commonSchema.ts";
import { updateFlagStatusSchema } from "../schemas/flagSchema.ts";

const flagRouter = Router();
const flagController = new FlagController();

flagRouter.get("/", flagController.getFlags);
flagRouter.put(
  "/:id",
  validate(idParamSchema, "params"),
  validate(updateFlagStatusSchema, "body"),
  flagController.updateFlagStatus,
);

export { flagRouter };