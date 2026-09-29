import { extendZodWithOpenApi } from "@asteasolutions/zod-to-openapi";
import { z } from "zod";

extendZodWithOpenApi(z);

export const createAuditLogSchema = z
  .object({
    userId: z
      .number({ invalid_type_error: "userId harus berupa angka" })
      .int("userId harus bilangan bulat")
      .positive("userId harus lebih dari 0")
      .openapi({ example: 1, description: "ID user pelaku aktivitas" }),
    action: z
      .string({ required_error: "action wajib diisi" })
      .trim()
      .min(1, "action wajib diisi")
      .max(50, "action maksimal 50 karakter")
      .openapi({ example: "UPDATE", description: "Jenis aksi" }),
    targetTable: z
      .string({ required_error: "targetTable wajib diisi" })
      .trim()
      .min(1, "targetTable wajib diisi")
      .max(50, "targetTable maksimal 50 karakter")
      .openapi({ example: "STALLS", description: "Nama tabel target" }),
    targetId: z
      .number({
        required_error: "targetId wajib diisi",
        invalid_type_error: "targetId harus berupa angka",
      })
      .int("targetId harus bilangan bulat")
      .positive("targetId harus lebih dari 0")
      .openapi({ example: 3, description: "ID data yang diubah" }),
    metadata: z
      .string()
      .nullable()
      .optional()
      .openapi({ example: '{"name":"Warung Baru"}', description: "Detail tambahan (teks/JSON string)" }),
  })
  .strict();

export type CreateAuditLogInput = z.infer<typeof createAuditLogSchema>;