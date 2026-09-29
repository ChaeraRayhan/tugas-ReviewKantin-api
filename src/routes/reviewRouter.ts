import { Router } from "express";
import { ReviewController } from "../controllers/reviewController.ts";
import { validate } from "../middlewares/validate.ts";
import { idParamSchema } from "../schemas/commonSchema.ts";
import { createReviewSchema } from "../schemas/reviewSchema.ts";

const reviewRouter = Router();
const reviewController = new ReviewController();

reviewRouter.get("/", reviewController.getReviews);
reviewRouter.post(
  "/",
  validate(createReviewSchema, "body"),
  reviewController.createReview,
);
reviewRouter.delete(
  "/:id",
  validate(idParamSchema, "params"),
  reviewController.deleteReview,
);

export { reviewRouter };