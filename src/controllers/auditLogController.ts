import type { Request, Response } from "express";
import { AuditLogService } from "../services/auditLogService.ts";
import { getValidated } from "../middlewares/validate.ts";
import type { CreateAuditLogInput } from "../schemas/auditlogSchema.ts";

export class AuditLogController {
  private auditLogService: AuditLogService;

  constructor(auditLogService: AuditLogService = new AuditLogService()) {
    this.auditLogService = auditLogService;
  }

  getAuditLogs = async (_req: Request, res: Response): Promise<void> => {
    const data = await this.auditLogService.getAllAuditLogs();
    res.status(200).json({ status: "success", data });
  };

  createAuditLog = async (_req: Request, res: Response): Promise<void> => {
    const body = getValidated<CreateAuditLogInput>(res, "body");
    const log = await this.auditLogService.createAuditLog(body);
    res.status(201).json({ status: "success", data: log });
  };
}