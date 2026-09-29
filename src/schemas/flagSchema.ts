import { extendZodWithOpenApi } from "@asteasolutions/zod-to-openapi";
import { z } from "zod";

extendZodWithOpenApi(z);

export const updateFlagStatusSchema = z
  .object({
    status: z
      .enum(["pending", "resolved", "dismissed"], {
        errorMap: () => ({
          message: "status wajib diisi: pending, resolved, atau dismissed",
        }),
      })
      .openapi({ example: "resolved", description: "Status tindak lanjut flag" }),
  })
  .strict();

export type UpdateFlagStatusInput = z.infer<typeof updateFlagStatusSchema>;