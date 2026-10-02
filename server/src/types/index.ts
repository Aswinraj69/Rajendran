export type UserRole = "admin";

export interface JwtPayload {
  userId: string;
  role: UserRole;
}

export type ContentStatus = "draft" | "published";
