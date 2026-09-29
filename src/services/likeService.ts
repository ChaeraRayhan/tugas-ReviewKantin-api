import { LikeRepository } from "../repositories/likeRepository.ts";
import type { LikeResponseDto } from "../dtos/likeDto.ts";
import { AppError } from "../errors/AppError.ts";
import { NotFoundError } from "../errors/NotFoundError.ts";
import type { CreateLikeInput } from "../schemas/likeSchema.ts";
import type { likes } from "../db/schema.ts";

type LikeRow = typeof likes.$inferSelect;

export class LikeService {
  private likeRepository: LikeRepository;

  constructor(likeRepository: LikeRepository = new LikeRepository()) {
    this.likeRepository = likeRepository;
  }

  private toDto(row: LikeRow): LikeResponseDto {
    return {
      id: row.id,
      reviewId: row.reviewId,
      userId: row.userId,
      createdAt: row.createdAt,
    };
  }

  async createLike(input: CreateLikeInput): Promise<LikeResponseDto> {
    const row = await this.likeRepository.create(input);
    if (!row) throw new AppError(500, "Like gagal dibuat");
    return this.toDto(row);
  }

  async deleteLike(id: number): Promise<LikeResponseDto> {
    const row = await this.likeRepository.remove(id);
    if (!row) throw new NotFoundError("Like tidak ditemukan");
    return this.toDto(row);
  }
}