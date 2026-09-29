import { AuditLogRepository } from "../repositories/auditLogRepository.ts";
import type { AuditLogResponseDto } from "../dtos/auditLogDto.ts";
import { AppError } from "../errors/AppError.ts";
import type { CreateAuditLogInput } from "../schemas/auditlogSchema.ts";
import type { auditLogs } from "../db/schema.ts";

type AuditLogRow = typeof auditLogs.$inferSelect;

export class AuditLogService {
  private auditLogRepository: AuditLogRepository;

  constructor(
    auditLogRepository: AuditLogRepository = new AuditLogRepository(),
  ) {
    this.auditLogRepository = auditLogRepository;
  }

  private toDto(row: AuditLogRow): AuditLogResponseDto {
    return {
      id: row.id,
      userId: row.userId,
      action: row.action,
      targetTable: row.targetTable,
      targetId: row.targetId,
      metadata: row.metadata,
      createdAt: row.createdAt,
    };
  }

  async getAllAuditLogs(): Promise<AuditLogResponseDto[]> {
    const rows = await this.auditLogRepository.findAll();
    return rows.map((row) => this.toDto(row));
  }

  async createAuditLog(input: CreateAuditLogInput): Promise<AuditLogResponseDto> {
    const row = await this.auditLogRepository.create(input);
    if (!row) throw new AppError(500, "Audit log gagal dibuat");
    return this.toDto(row);
  }
}