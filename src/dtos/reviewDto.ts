export interface ReviewResponseDto {
  id: number;
  stallId: number;
  userId: number;
  rating: number;
  comment: string | null;
  likeCount: number;
  createdAt: Date | null;
  updatedAt: Date | null;
}

// Hasil JOIN REVIEWS -> USERS.
export interface ReviewWithUserDto {
  id: number;
  stallId: number;
  rating: number;
  comment: string | null;
  likeCount: number;
  createdAt: Date | null;
  updatedAt: Date | null;
  user: { id: number; name: string };
}