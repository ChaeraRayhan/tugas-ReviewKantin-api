import { getDb } from '../db/index.ts';
import { users } from '../db/schema.ts';

export interface CreateUserRow {
  name: string;
  email: string;
  passwordHash: string;
  role: 'admin' | 'owner' | 'customer';
}

export class UserRepository {
  async findAll() {
    const db = await getDb();
    return db.select().from(users).orderBy(users.id);
  }

  async create(input: CreateUserRow) {
    const db = await getDb();
    const rows = await db.insert(users).output().values({
      name: input.name,
      email: input.email,
      passwordHash: input.passwordHash,
      role: input.role,
    });
    return rows[0];
  }
}