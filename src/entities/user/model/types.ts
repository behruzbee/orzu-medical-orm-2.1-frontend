export type UserRole = "admin" | "doctor" | "operator";

export interface User {
  id: string;
  name: string;
  phone: string;
  role: UserRole;
  avatar?: string | null;
  isActive: boolean;
  createdAt?: string;
}
