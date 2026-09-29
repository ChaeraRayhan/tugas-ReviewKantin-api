import { eq } from 'drizzle-orm';
import { getDb } from '../db/index.ts';
import { reviews, users } from '../db/schema.ts';

export interface CreateReviewRow {
  stallId: number;
  userId: number;
  rating: number;
  comment?: string | null;
}

export class ReviewRepository {
  // SELECT ... FROM REVIEWS INNER JOIN USERS ON REVIEWS.user_id = USERS.id
  async findAllWithUser() {
    const db = await getDb();
    return db
      .select({
        review: reviews,
        user: { id: users.id, name: users.name },
      })
      .from(reviews)
      .innerJoin(users, eq(reviews.userId, users.id))
      .orderBy(reviews.id);
  }

  async create(input: CreateReviewRow) {
    const db = await getDb();
    const rows = await db
      .insert(reviews)
      .output()
      .values({
        stallId: input.stallId,
        userId: input.userId,
        rating: input.rating,
        comment: input.comment ?? null,
        likeCount: 0,
      });
    return rows[0];
  }

  async remove(id: number) {
    const db = await getDb();
    const rows = await db.delete(reviews).where(eq(reviews.id, id)).output();
    return rows[0];
  }
}