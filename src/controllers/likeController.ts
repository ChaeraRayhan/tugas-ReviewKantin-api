import type { Request, Response } from "express";
import { LikeService } from "../services/likeService.ts";
import { getValidated } from "../middlewares/validate.ts";
import type { IdParam } from "../schemas/commonSchema.ts";
import type { CreateLikeInput } from "../schemas/likeSchema.ts";

export class LikeController {
  private likeService: LikeService;

  constructor(likeService: LikeService = new LikeService()) {
    this.likeService = likeService;
  }

  createLike = async (_req: Request, res: Response): Promise<void> => {
    const body = getValidated<CreateLikeInput>(res, "body");
    const like = await this.likeService.createLike(body);
    res.status(201).json({ status: "success", data: like });
  };

  deleteLike = async (_req: Request, res: Response): Promise<void> => {
    const { id } = getValidated<IdParam>(res, "params");
    const like = await this.likeService.deleteLike(id);
    res.status(200).json({ status: "success", data: like });
  };
}