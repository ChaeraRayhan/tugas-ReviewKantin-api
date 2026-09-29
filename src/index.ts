import express, { type Application } from "express";
import { sql } from "drizzle-orm";
import { getDb } from "./db/index.ts";
import { stallRouter } from "./routes/stallRouter.ts";
import { menuItemRouter } from "./routes/menuItemRouter.ts";
import { userRouter } from "./routes/userRouter.ts";
import { reviewRouter } from "./routes/reviewRouter.ts";
import { likeRouter } from "./routes/likeRouter.ts";
import { flagRouter } from "./routes/flagRouter.ts";
import { auditLogRouter } from "./routes/auditLogRouter.ts";
import { notFoundHandler } from "./middlewares/notFound.ts";
import { errorHandler } from "./middlewares/errorHandler.ts";

const app: Application = express();
const PORT: number = 3000;

app.use(express.json());

app.get("/health", async (_req, res) => {
  const db = await getDb();
  await db.execute(sql`SELECT 1 AS ok`);
  res
    .status(200)
    .json({ status: "success", message: "Server dan database terhubung" });
});

app.use("/api/v1/stalls", stallRouter);

app.use("/api/v1/menu-items", menuItemRouter);
app.use("/api/v1/users", userRouter);
app.use("/api/v1/reviews", reviewRouter);
app.use("/api/v1/likes", likeRouter);
app.use("/api/v1/flags", flagRouter);
app.use("/api/v1/audit-logs", auditLogRouter);
app.use(notFoundHandler);
app.use(errorHandler);

app.listen(PORT, () => {
  console.log(`Server berjalan di http://localhost:${PORT}`);
});