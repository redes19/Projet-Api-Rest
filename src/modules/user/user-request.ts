import { UserRole } from "../../database/entities/user.js";

export interface UserIdRequest {
  id: number;
}

export interface CreateUserRequest {
  email: string;
  password: string;
  role: UserRole;
  balance: number;
  first_name?: string | null;
  last_name?: string | null;
}

export interface UpdateUserRequest {
  id: number;
  email?: string;
  password?: string;
  role?: UserRole;
  balance?: number;
  first_name?: string | null;
  last_name?: string | null;
}

export interface ListUserRequest {
  page?: number;
  size?: number;
  balanceMax?: number;
}
