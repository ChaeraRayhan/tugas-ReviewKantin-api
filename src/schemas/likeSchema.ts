import { extendZodWithOpenApi } from "@asteasolutions/zod-to-openapi";
import { z } from "zod";

extendZodWithOpenApi(z);

export const createLikeSchema = z
  .object({
    reviewId: z
      .number({ invalid_type_error: "reviewId harus berupa angka" })
      .int("reviewId harus bilangan bulat")
      .positive("reviewId harus lebih dari 0")
      .openapi({ example: 2, description: "ID review yang di-like" }),
    userId: z
      .number({ invalid_type_error: "userId harus berupa angka" })
      .int("userId harus bilangan bulat")
      .positive("userId harus lebih dari 0")
      .openapi({ example: 15, description: "ID user yang me-like" }),
  })
  .strict();

export type CreateLikeInput = z.infer<typeof createLikeSchema>;