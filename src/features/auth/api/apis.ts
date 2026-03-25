import { api } from "@/shared/api/api";
import type { AuthResponse, LoginRequest } from "../model/types";
import type { User } from "@/entities/user";

export const authApi = {
  login: async (data: LoginRequest): Promise<AuthResponse> => {
    const response = await api.post<AuthResponse>("/auth/login", data);
    return response.data;
  },

  getQrStreamUrl: (): string => {
    const baseURL = api.defaults.baseURL || "";
    return `${baseURL}/auth/qr-stream`;
  },

  getMe: async (): Promise<User> => {
    const response = await api.get<User>("/auth/me");
    return response.data;
  },
};
