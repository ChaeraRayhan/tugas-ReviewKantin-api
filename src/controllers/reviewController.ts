import type { Request, Response } from "express";
import { ReviewService } from "../services/reviewService.ts";
import { getValidated } from "../middlewares/validate.ts";
import type { IdParam } from "../schemas/commonSchema.ts";
import type { CreateReviewInput } from "../schemas/reviewSchema.ts";

export class ReviewController {
  private reviewService: ReviewService;

  constructor(reviewService: ReviewService = new ReviewService()) {
    this.reviewService = reviewService;
  }

  getReviews = async (_req: Request, res: Response): Promise<void> => {
    const data = await this.reviewService.getAllReviews();
    res.status(200).json({ status: "success", data });
  };

  createReview = async (_req: Request, res: Response): Promise<void> => {
    const body = getValidated<CreateReviewInput>(res, "body");
    const review = await this.reviewService.createReview(body);
    res.status(201).json({ status: "success", data: review });
  };

  deleteReview = async (_req: Request, res: Response): Promise<void> => {
    const { id } = getValidated<IdParam>(res, "params");
    const review = await this.reviewService.deleteReview(id);
    res.status(200).json({ status: "success", data: review });
  };
}