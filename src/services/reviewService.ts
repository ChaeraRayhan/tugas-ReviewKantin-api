import { ReviewRepository } from "../repositories/reviewRepository.ts";
import type {
  ReviewResponseDto,
  ReviewWithUserDto,
} from "../dtos/reviewDto.ts";
import { AppError } from "../errors/AppError.ts";
import { NotFoundError } from "../errors/NotFoundError.ts";
import type { CreateReviewInput } from "../schemas/reviewSchema.ts";
import type { reviews } from "../db/schema.ts";

type ReviewRow = typeof reviews.$inferSelect;

export class ReviewService {
  private reviewRepository: ReviewRepository;

  constructor(reviewRepository: ReviewRepository = new ReviewRepository()) {
    this.reviewRepository = reviewRepository;
  }

  private toDto(row: ReviewRow): ReviewResponseDto {
    return {
      id: row.id,
      stallId: row.stallId,
      userId: row.userId,
      rating: row.rating,
      comment: row.comment,
      likeCount: row.likeCount,
      createdAt: row.createdAt,
      updatedAt: row.updatedAt,
    };
  }

  async getAllReviews(): Promise<ReviewWithUserDto[]> {
    const rows = await this.reviewRepository.findAllWithUser();
    return rows.map(({ review, user }) => ({
      id: review.id,
      stallId: review.stallId,
      rating: review.rating,
      comment: review.comment,
      likeCount: review.likeCount,
      createdAt: review.createdAt,
      updatedAt: review.updatedAt,
      user,
    }));
  }

  async createReview(input: CreateReviewInput): Promise<ReviewResponseDto> {
    const row = await this.reviewRepository.create(input);
    if (!row) throw new AppError(500, "Review gagal dibuat");
    return this.toDto(row);
  }

  async deleteReview(id: number): Promise<ReviewResponseDto> {
    const row = await this.reviewRepository.remove(id);
    if (!row) throw new NotFoundError("Review tidak ditemukan");
    return this.toDto(row);
  }
}