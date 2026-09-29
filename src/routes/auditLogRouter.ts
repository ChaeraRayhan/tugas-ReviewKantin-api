import { Router } from "express";
import { AuditLogController } from "../controllers/auditLogController.ts";
import { validate } from "../middlewares/validate.ts";
import { createAuditLogSchema } from "../schemas/auditlogSchema.ts";
const auditLogRouter = Router();
const auditLogController = new AuditLogController();

auditLogRouter.get("/", auditLogController.getAuditLogs);
auditLogRouter.post(
  "/",
  validate(createAuditLogSchema, "body"),
  auditLogController.createAuditLog,
);

export { auditLogRouter };