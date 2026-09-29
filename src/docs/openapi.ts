import {
  OpenAPIRegistry,
  OpenApiGeneratorV3,
} from "@asteasolutions/zod-to-openapi";
import { z, type ZodTypeAny } from "zod";
import { idParamSchema as stallIdParamSchema, createStallSchema, stallQuerySchema, updateStallSchema } from "../schemas/stallSchema.ts";
import { idParamSchema } from "../schemas/commonSchema.ts";
import { createUserSchema } from "../schemas/userSchema.ts";
import { createMenuItemSchema, updateMenuItemSchema } from "../schemas/menuitemschema.ts";
import { createReviewSchema } from "../schemas/reviewSchema.ts";
import { createLikeSchema } from "../schemas/likeSchema.ts";
import { updateFlagStatusSchema } from "../schemas/flagSchema.ts";
import { createAuditLogSchema } from "../schemas/auditlogSchema.ts";

const registry = new OpenAPIRegistry();

const dateExample = "2026-09-14T00:00:00.000Z";

// ----------------------------------------------------------------- schema
// Komponen schema untuk RESPONS (dibuat khusus di sini). Schema untuk BODY
// sudah didefinisikan di folder schemas/ dan hanya "didaftarkan" agar dipakai
// ulang lewat $ref (satu sumber kebenaran: validasi + dokumentasi).
const stallSchema = registry.register(
  "Stall",
  z.object({
    id: z.number().openapi({ example: 1 }),
    ownerId: z.number().openapi({ example: 2 }),
    name: z.string().openapi({ example: "Warung Bu Tini" }),
    category: z.string().nullable().openapi({ example: "Kwetiau" }),
    location: z.string().nullable().openapi({ example: "Kantin FKIP" }),
    description: z
      .string()
      .nullable()
      .openapi({ example: "Kedai kwetiau goreng & kuah" }),
    avgRating: z.number().openapi({ example: 4.5 }),
    reviewCount: z.number().openapi({ example: 2 }),
    isPopular: z.boolean().openapi({ example: false }),
  }),
);

const menuSchema = registry.register(
  "Menu",
  z.object({
    id: z.number().openapi({ example: 1 }),
    stallId: z.number().openapi({ example: 2 }),
    name: z.string().openapi({ example: "Kwetiau Goreng Spesial" }),
    price: z.number().openapi({ example: 15000 }),
    isAvailable: z.boolean().openapi({ example: true }),
  }),
);

const menuDetailSchema = registry.register(
  "MenuDetail",
  menuSchema.extend({
    stall: z.object({
      id: z.number().openapi({ example: 1 }),
      name: z.string().openapi({ example: "Warung Bu Tini" }),
      category: z.string().nullable().openapi({ example: "Kwetiau" }),
      location: z.string().nullable().openapi({ example: "Kantin FKIP" }),
    }),
  }),
);

const userSchema = registry.register(
  "User",
  z.object({
    id: z.number().openapi({ example: 12 }),
    name: z.string().openapi({ example: "Bagas Pratama" }),
    email: z.string().openapi({ example: "bagas@student.test" }),
    role: z.enum(["admin", "owner", "customer"]).openapi({ example: "customer" }),
    createdAt: z.string().nullable().openapi({ example: dateExample }),
  }),
);

const reviewSchema = registry.register(
  "Review",
  z.object({
    id: z.number().openapi({ example: 1 }),
    stallId: z.number().openapi({ example: 1 }),
    userId: z.number().openapi({ example: 12 }),
    rating: z.number().openapi({ example: 5 }),
    comment: z.string().nullable().openapi({ example: "Enak!" }),
    likeCount: z.number().openapi({ example: 2 }),
    createdAt: z.string().nullable().openapi({ example: dateExample }),
    updatedAt: z.string().nullable().openapi({ example: null }),
  }),
);

const reviewWithUserSchema = registry.register(
  "ReviewWithUser",
  z.object({
    id: z.number().openapi({ example: 1 }),
    stallId: z.number().openapi({ example: 1 }),
    rating: z.number().openapi({ example: 5 }),
    comment: z.string().nullable().openapi({ example: "Enak!" }),
    likeCount: z.number().openapi({ example: 2 }),
    createdAt: z.string().nullable().openapi({ example: dateExample }),
    updatedAt: z.string().nullable().openapi({ example: null }),
    user: z.object({
      id: z.number().openapi({ example: 12 }),
      name: z.string().openapi({ example: "Bagas Pratama" }),
    }),
  }),
);

const likeSchema = registry.register(
  "Like",
  z.object({
    id: z.number().openapi({ example: 1 }),
    reviewId: z.number().openapi({ example: 1 }),
    userId: z.number().openapi({ example: 13 }),
    createdAt: z.string().nullable().openapi({ example: dateExample }),
  }),
);

const flagSchema = registry.register(
  "Flag",
  z.object({
    id: z.number().openapi({ example: 1 }),
    reviewId: z.number().openapi({ example: 3 }),
    reportedBy: z.number().openapi({ example: 13 }),
    reason: z.string().nullable().openapi({ example: "Diduga spam" }),
    status: z.string().openapi({ example: "pending" }),
    createdAt: z.string().nullable().openapi({ example: dateExample }),
  }),
);

const auditLogSchema = registry.register(
  "AuditLog",
  z.object({
    id: z.number().openapi({ example: 1 }),
    userId: z.number().openapi({ example: 2 }),
    action: z.string().openapi({ example: "CREATE" }),
    targetTable: z.string().openapi({ example: "STALLS" }),
    targetId: z.number().openapi({ example: 1 }),
    metadata: z.string().nullable().openapi({ example: '{"name":"Warung Bu Tini"}' }),
    createdAt: z.string().nullable().openapi({ example: dateExample }),
  }),
);

const errorSchema = registry.register(
  "ErrorResponse",
  z.object({
    status: z.string().openapi({ example: "fail" }),
    message: z.string().openapi({ example: "Validasi gagal" }),
    errors: z
      .array(z.object({ field: z.string(), message: z.string() }))
      .optional()
      .openapi({
        example: [{ field: "name", message: "name minimal 3 karakter" }],
      }),
  }),
);

// Schema body yang DIPAKAI VALIDASI juga didaftarkan sebagai komponen.
// Nilai kembalian `register` dipakai sebagai referensi ($ref) di requestBody.
const stallInput = registry.register("StallInput", createStallSchema);
const stallUpdate = registry.register("StallUpdate", updateStallSchema);
const userInput = registry.register("UserInput", createUserSchema);
const menuInput = registry.register("MenuInput", createMenuItemSchema);
const menuUpdate = registry.register("MenuUpdate", updateMenuItemSchema);
const reviewInput = registry.register("ReviewInput", createReviewSchema);
const likeInput = registry.register("LikeInput", createLikeSchema);
const flagStatusInput = registry.register("FlagStatusInput", updateFlagStatusSchema);
const auditLogInput = registry.register("AuditLogInput", createAuditLogSchema);

// ------------------------------------------------------- helper pembungkus
const success = <T extends ZodTypeAny>(data: T) =>
  z.object({ status: z.literal("success"), data });

const jsonResponse = (description: string, schema: ZodTypeAny) => ({
  description,
  content: { "application/json": { schema } },
});

const errorResponse = (description: string) =>
  jsonResponse(description, errorSchema);

const jsonBody = (description: string, schema: ZodTypeAny) => ({
  description,
  content: { "application/json": { schema } },
});

const stallListResponse = registry.register(
  "StallListResponse",
  z.object({
    status: z.literal("success"),
    meta: z.object({
      page: z.number().openapi({ example: 1 }),
      limit: z.number().openapi({ example: 10 }),
      total: z.number().openapi({ example: 10 }),
    }),
    data: z.array(stallSchema),
  }),
);

const stallDetailResponse = registry.register("StallDetailResponse", success(stallSchema));
const menuListResponse = registry.register("MenuListResponse", success(z.array(menuSchema)));

// ------------------------------------------------------------------ routes
registry.registerPath({
  method: "get",
  path: "/health",
  tags: ["Health"],
  summary: "Cek kesehatan server & database",
  responses: {
    200: jsonResponse(
      "Server dan database terhubung",
      z.object({ status: z.literal("success"), message: z.string() }),
    ),
    500: errorResponse("Kesalahan pada server"),
  },
});

// ---- USERS
registry.registerPath({
  method: "get",
  path: "/api/v1/users",
  tags: ["Users"],
  summary: "Daftar user",
  responses: {
    200: jsonResponse("Daftar user", success(z.array(userSchema))),
    500: errorResponse("Kesalahan pada server"),
  },
});

registry.registerPath({
  method: "post",
  path: "/api/v1/users",
  tags: ["Users"],
  summary: "Tambah user",
  request: { body: jsonBody("Data user baru", userInput) },
  responses: {
    201: jsonResponse("User berhasil dibuat", success(userSchema)),
    400: errorResponse("Body tidak valid"),
    409: errorResponse("Data bentrok dengan data yang sudah ada (mis. email sudah dipakai)"),
    500: errorResponse("Kesalahan pada server"),
  },
});

// ---- STALLS
registry.registerPath({
  method: "get",
  path: "/api/v1/stalls",
  tags: ["Stalls"],
  summary: "Daftar warung",
  description:
    "Daftar warung dengan filter `search`/`category` dan pagination.",
  request: { query: stallQuerySchema },
  responses: {
    200: jsonResponse("Daftar warung + meta pagination", stallListResponse),
    400: errorResponse("Query parameter tidak valid"),
    500: errorResponse("Kesalahan pada server"),
  },
});

registry.registerPath({
  method: "post",
  path: "/api/v1/stalls",
  tags: ["Stalls"],
  summary: "Tambah warung",
  request: { body: jsonBody("Data warung baru", stallInput) },
  responses: {
    201: jsonResponse("Warung berhasil dibuat", stallDetailResponse),
    400: errorResponse("Body tidak valid"),
    409: errorResponse("Data bentrok dengan data yang sudah ada"),
    500: errorResponse("Kesalahan pada server"),
  },
});

registry.registerPath({
  method: "get",
  path: "/api/v1/stalls/{id}",
  tags: ["Stalls"],
  summary: "Detail warung",
  request: { params: stallIdParamSchema },
  responses: {
    200: jsonResponse("Detail warung", stallDetailResponse),
    400: errorResponse("Parameter id tidak valid"),
    404: errorResponse("Warung tidak ditemukan"),
    500: errorResponse("Kesalahan pada server"),
  },
});

registry.registerPath({
  method: "put",
  path: "/api/v1/stalls/{id}",
  tags: ["Stalls"],
  summary: "Update warung",
  request: {
    params: stallIdParamSchema,
    body: jsonBody("Data warung yang diubah (boleh sebagian)", stallUpdate),
  },
  responses: {
    200: jsonResponse("Warung ter-update", stallDetailResponse),
    400: errorResponse("Body/parameter tidak valid"),
    404: errorResponse("Warung tidak ditemukan"),
    409: errorResponse("Data bentrok dengan data yang sudah ada"),
    500: errorResponse("Kesalahan pada server"),
  },
});

registry.registerPath({
  method: "delete",
  path: "/api/v1/stalls/{id}",
  tags: ["Stalls"],
  summary: "Hapus warung",
  request: { params: stallIdParamSchema },
  responses: {
    200: jsonResponse("Warung terhapus", stallDetailResponse),
    400: errorResponse("Parameter id tidak valid"),
    404: errorResponse("Warung tidak ditemukan"),
    500: errorResponse("Kesalahan pada server"),
  },
});

registry.registerPath({
  method: "get",
  path: "/api/v1/stalls/{id}/menus",
  tags: ["Stalls"],
  summary: "Daftar menu sebuah warung",
  request: { params: stallIdParamSchema },
  responses: {
    200: jsonResponse("Daftar menu milik warung", menuListResponse),
    400: errorResponse("Parameter id tidak valid"),
    404: errorResponse("Warung tidak ditemukan"),
    500: errorResponse("Kesalahan pada server"),
  },
});

// ---- MENU_ITEMS
registry.registerPath({
  method: "get",
  path: "/api/v1/menu-items",
  tags: ["Menu Items"],
  summary: "Daftar menu (JOIN warung)",
  responses: {
    200: jsonResponse("Daftar menu beserta data warung", success(z.array(menuDetailSchema))),
    500: errorResponse("Kesalahan pada server"),
  },
});

registry.registerPath({
  method: "get",
  path: "/api/v1/menu-items/{id}",
  tags: ["Menu Items"],
  summary: "Detail menu (JOIN warung)",
  request: { params: idParamSchema },
  responses: {
    200: jsonResponse("Detail menu beserta data warung", success(menuDetailSchema)),
    400: errorResponse("Parameter id tidak valid"),
    404: errorResponse("Menu tidak ditemukan"),
    500: errorResponse("Kesalahan pada server"),
  },
});

registry.registerPath({
  method: "post",
  path: "/api/v1/menu-items",
  tags: ["Menu Items"],
  summary: "Tambah menu",
  request: { body: jsonBody("Data menu baru", menuInput) },
  responses: {
    201: jsonResponse("Menu berhasil dibuat", success(menuSchema)),
    400: errorResponse("Body tidak valid"),
    409: errorResponse("Data bentrok dengan data yang sudah ada (mis. stallId tidak ada)"),
    500: errorResponse("Kesalahan pada server"),
  },
});

registry.registerPath({
  method: "put",
  path: "/api/v1/menu-items/{id}",
  tags: ["Menu Items"],
  summary: "Update menu",
  request: {
    params: idParamSchema,
    body: jsonBody("Data menu yang diubah (boleh sebagian)", menuUpdate),
  },
  responses: {
    200: jsonResponse("Menu ter-update", success(menuSchema)),
    400: errorResponse("Body/parameter tidak valid"),
    404: errorResponse("Menu tidak ditemukan"),
    409: errorResponse("Data bentrok dengan data yang sudah ada"),
    500: errorResponse("Kesalahan pada server"),
  },
});

registry.registerPath({
  method: "delete",
  path: "/api/v1/menu-items/{id}",
  tags: ["Menu Items"],
  summary: "Hapus menu",
  request: { params: idParamSchema },
  responses: {
    200: jsonResponse("Menu terhapus", success(menuSchema)),
    400: errorResponse("Parameter id tidak valid"),
    404: errorResponse("Menu tidak ditemukan"),
    500: errorResponse("Kesalahan pada server"),
  },
});

// ---- REVIEWS
registry.registerPath({
  method: "get",
  path: "/api/v1/reviews",
  tags: ["Reviews"],
  summary: "Daftar review (JOIN user)",
  responses: {
    200: jsonResponse("Daftar review beserta data user", success(z.array(reviewWithUserSchema))),
    500: errorResponse("Kesalahan pada server"),
  },
});

registry.registerPath({
  method: "post",
  path: "/api/v1/reviews",
  tags: ["Reviews"],
  summary: "Tambah review",
  request: { body: jsonBody("Data review baru", reviewInput) },
  responses: {
    201: jsonResponse("Review berhasil dibuat", success(reviewSchema)),
    400: errorResponse("Body tidak valid"),
    409: errorResponse("Data bentrok (mis. customer sudah mengulas warung ini)"),
    500: errorResponse("Kesalahan pada server"),
  },
});

registry.registerPath({
  method: "delete",
  path: "/api/v1/reviews/{id}",
  tags: ["Reviews"],
  summary: "Hapus review",
  request: { params: idParamSchema },
  responses: {
    200: jsonResponse("Review terhapus", success(reviewSchema)),
    400: errorResponse("Parameter id tidak valid"),
    404: errorResponse("Review tidak ditemukan"),
    500: errorResponse("Kesalahan pada server"),
  },
});

// ---- LIKES
registry.registerPath({
  method: "post",
  path: "/api/v1/likes",
  tags: ["Likes"],
  summary: "Tambah like pada review",
  request: { body: jsonBody("Data like baru", likeInput) },
  responses: {
    201: jsonResponse("Like berhasil dibuat", success(likeSchema)),
    400: errorResponse("Body tidak valid"),
    409: errorResponse("Data bentrok (mis. user sudah me-like review ini)"),
    500: errorResponse("Kesalahan pada server"),
  },
});

registry.registerPath({
  method: "delete",
  path: "/api/v1/likes/{id}",
  tags: ["Likes"],
  summary: "Hapus like",
  request: { params: idParamSchema },
  responses: {
    200: jsonResponse("Like terhapus", success(likeSchema)),
    400: errorResponse("Parameter id tidak valid"),
    404: errorResponse("Like tidak ditemukan"),
    500: errorResponse("Kesalahan pada server"),
  },
});

// ---- FLAGS
registry.registerPath({
  method: "get",
  path: "/api/v1/flags",
  tags: ["Flags"],
  summary: "Daftar flag",
  responses: {
    200: jsonResponse("Daftar flag", success(z.array(flagSchema))),
    500: errorResponse("Kesalahan pada server"),
  },
});

registry.registerPath({
  method: "put",
  path: "/api/v1/flags/{id}",
  tags: ["Flags"],
  summary: "Update status flag",
  request: {
    params: idParamSchema,
    body: jsonBody("Status baru flag", flagStatusInput),
  },
  responses: {
    200: jsonResponse("Status flag ter-update", success(flagSchema)),
    400: errorResponse("Body/parameter tidak valid"),
    404: errorResponse("Flag tidak ditemukan"),
    500: errorResponse("Kesalahan pada server"),
  },
});

// ---- AUDIT_LOGS
registry.registerPath({
  method: "get",
  path: "/api/v1/audit-logs",
  tags: ["Audit Logs"],
  summary: "Daftar audit log",
  responses: {
    200: jsonResponse("Daftar audit log", success(z.array(auditLogSchema))),
    500: errorResponse("Kesalahan pada server"),
  },
});

registry.registerPath({
  method: "post",
  path: "/api/v1/audit-logs",
  tags: ["Audit Logs"],
  summary: "Tambah audit log",
  request: { body: jsonBody("Data audit log baru", auditLogInput) },
  responses: {
    201: jsonResponse("Audit log berhasil dibuat", success(auditLogSchema)),
    400: errorResponse("Body tidak valid"),
    409: errorResponse("Data bentrok (mis. userId tidak ada)"),
    500: errorResponse("Kesalahan pada server"),
  },
});

// ----------------------------------------------------------------- generate
// Dokumen OpenAPI 3.0 dihasilkan IN-MEMORY (tanpa file), lalu disajikan
// swagger-ui-express di /docs — selalu sinkron dengan schema terbaru.
const generator = new OpenApiGeneratorV3(registry.definitions);

export const openApiDocument = generator.generateDocument({
  openapi: "3.0.0",
  info: {
    title: "Review Kantin API",
    version: "1.0.0",
    description:
      "Dokumentasi OpenAPI 3.0 yang dibangkitkan otomatis dari schema zod " +
      "(@asteasolutions/zod-to-openapi) — satu sumber kebenaran untuk validasi dan dokumentasi.",
  },
  servers: [{ url: "http://localhost:3000" }],
});