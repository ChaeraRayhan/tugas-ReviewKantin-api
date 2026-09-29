// passwordHash sengaja tidak ada di DTO: detail sensitif database tidak dikirim ke client.
export interface UserResponseDto {
  id: number;
  name: string;
  email: string;
  role: "admin" | "owner" | "customer";
  createdAt: Date | null;
}