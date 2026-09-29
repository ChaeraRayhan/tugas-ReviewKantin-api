import { randomBytes, scryptSync } from "node:crypto";
import { UserRepository } from "../repositories/userRepository.ts";
import type { UserResponseDto } from "../dtos/userDto.ts";
import { AppError } from "../errors/AppError.ts";
import type { CreateUserInput } from "../schemas/userSchema.ts";
import type { users } from "../db/schema.ts";

type UserRow = typeof users.$inferSelect;

export class UserService {
  private userRepository: UserRepository;

  constructor(userRepository: UserRepository = new UserRepository()) {
    this.userRepository = userRepository;
  }

  // Password tidak pernah disimpan mentah: disimpan sebagai salt:hash (scrypt).
  private hashPassword(password: string): string {
    const salt = randomBytes(16).toString("hex");
    const hash = scryptSync(password, salt, 64).toString("hex");
    return `${salt}:${hash}`;
  }

  // Mapping row DB -> DTO API (passwordHash tidak ikut dikirim).
  private toDto(row: UserRow): UserResponseDto {
    return {
      id: row.id,
      name: row.name,
      email: row.email,
      role: row.role,
      createdAt: row.createdAt,
    };
  }

  async getAllUsers(): Promise<UserResponseDto[]> {
    const rows = await this.userRepository.findAll();
    return rows.map((row) => this.toDto(row));
  }

  async createUser(input: CreateUserInput): Promise<UserResponseDto> {
    const row = await this.userRepository.create({
      name: input.name,
      email: input.email,
      passwordHash: this.hashPassword(input.password),
      role: input.role,
    });
    if (!row) throw new AppError(500, "User gagal dibuat");
    return this.toDto(row);
  }
}