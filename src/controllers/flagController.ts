import type { Request, Response } from "express";
import { FlagService } from "../services/flagService.ts";
import { getValidated } from "../middlewares/validate.ts";
import type { IdParam } from "../schemas/commonSchema.ts";
import type { UpdateFlagStatusInput } from "../schemas/flagSchema.ts";

export class FlagController {
  private flagService: FlagService;

  constructor(flagService: FlagService = new FlagService()) {
    this.flagService = flagService;
  }

  getFlags = async (_req: Request, res: Response): Promise<void> => {
    const data = await this.flagService.getAllFlags();
    res.status(200).json({ status: "success", data });
  };

  updateFlagStatus = async (_req: Request, res: Response): Promise<void> => {
    const { id } = getValidated<IdParam>(res, "params");
    const body = getValidated<UpdateFlagStatusInput>(res, "body");
    const flag = await this.flagService.updateFlagStatus(id, body);
    res.status(200).json({ status: "success", data: flag });
  };
}