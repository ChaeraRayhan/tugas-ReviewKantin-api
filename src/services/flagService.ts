import { FlagRepository } from "../repositories/flagRepository.ts";
import type { FlagResponseDto } from "../dtos/flagDto.ts";
import { NotFoundError } from "../errors/NotFoundError.ts";
import type { UpdateFlagStatusInput } from "../schemas/flagSchema.ts";
import type { flags } from "../db/schema.ts";

type FlagRow = typeof flags.$inferSelect;

export class FlagService {
  private flagRepository: FlagRepository;

  constructor(flagRepository: FlagRepository = new FlagRepository()) {
    this.flagRepository = flagRepository;
  }

  private toDto(row: FlagRow): FlagResponseDto {
    return {
      id: row.id,
      reviewId: row.reviewId,
      reportedBy: row.reportedBy,
      reason: row.reason,
      status: row.status,
      createdAt: row.createdAt,
    };
  }

  async getAllFlags(): Promise<FlagResponseDto[]> {
    const rows = await this.flagRepository.findAll();
    return rows.map((row) => this.toDto(row));
  }

  async updateFlagStatus(
    id: number,
    input: UpdateFlagStatusInput,
  ): Promise<FlagResponseDto> {
    const row = await this.flagRepository.updateStatus(id, input.status);
    if (!row) throw new NotFoundError("Flag tidak ditemukan");
    return this.toDto(row);
  }
}