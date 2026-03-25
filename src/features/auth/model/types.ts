import type { User } from "@/entities/user";

export interface AuthResponse {
  accessToken: string;
  user: User;
}
export interface LoginRequest {
  method: "pin" | "qr";
  phone?: string;
  pin?: string;
}
