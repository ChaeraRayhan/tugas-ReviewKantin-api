import { extendZodWithOpenApi } from "@asteasolutions/zod-to-openapi";
import { z } from "zod";

extendZodWithOpenApi(z);

export const createMenuItemSchema = z
  .object({
    stallId: z
      .number({ invalid_type_error: "stallId harus berupa angka" })
      .int("stallId harus bilangan bulat")
      .positive("stallId harus lebih dari 0")
      .openapi({ example: 1, description: "ID warung pemilik menu" }),
    name: z
      .string({ required_error: "name wajib diisi" })
      .trim()
      .min(3, "name minimal 3 karakter")
      .max(100, "name maksimal 100 karakter")
      .openapi({ example: "Kwetiau Siram", description: "Nama menu" }),
    price: z
      .number({
        required_error: "price wajib diisi",
        invalid_type_error: "price harus berupa angka",
      })
      .int("price harus bilangan bulat")
      .min(0, "price tidak boleh negatif")
      .openapi({ example: 16000, description: "Harga menu (rupiah)" }),
    isAvailable: z
      .boolean({ invalid_type_error: "isAvailable harus true/false" })
      .optional()
      .openapi({ example: true, description: "Status ketersediaan (default true)" }),
  })
  .strict();

// Semua kolom opsional untuk PUT (update sebagian).
export const updateMenuItemSchema = createMenuItemSchema.partial();

export type CreateMenuItemInput = z.infer<typeof createMenuItemSchema>;
export type UpdateMenuItemInput = z.infer<typeof updateMenuItemSchema>;