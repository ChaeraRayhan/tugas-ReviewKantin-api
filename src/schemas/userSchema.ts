import { extendZodWithOpenApi } from "@asteasolutions/zod-to-openapi";
import { z } from "zod";

extendZodWithOpenApi(z);

export const createUserSchema = z
  .object({
    name: z
      .string({ required_error: "name wajib diisi" })
      .trim()
      .min(3, "name minimal 3 karakter")
      .max(100, "name maksimal 100 karakter")
      .openapi({ example: "Rina Kusuma", description: "Nama pengguna" }),
    email: z
      .string({ required_error: "email wajib diisi" })
      .trim()
      .email("format email tidak valid")
      .max(150, "email maksimal 150 karakter")
      .openapi({ example: "rina@student.test", description: "Email (unik)" }),
    password: z
      .string({ required_error: "password wajib diisi" })
      .min(8, "password minimal 8 karakter")
      .max(100, "password maksimal 100 karakter")
      .openapi({ example: "rahasia123", description: "Password (disimpan sebagai hash)" }),
    role: z
      .enum(["admin", "owner", "customer"], {
        errorMap: () => ({ message: "role wajib diisi: admin, owner, atau customer" }),
      })
      .openapi({ example: "customer", description: "Peran pengguna" }),
  })
  .strict();

export type CreateUserInput = z.infer<typeof createUserSchema>;