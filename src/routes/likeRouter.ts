import { Router } from "express";
import { LikeController } from "../controllers/likeController.ts";
import { validate } from "../middlewares/validate.ts";
import { idParamSchema } from "../schemas/commonSchema.ts";
import { createLikeSchema } from "../schemas/likeSchema.ts";

const likeRouter = Router();
const likeController = new LikeController();

likeRouter.post("/", validate(createLikeSchema, "body"), likeController.createLike);
likeRouter.delete(
  "/:id",
  validate(idParamSchema, "params"),
  likeController.deleteLike,
);

export { likeRouter };