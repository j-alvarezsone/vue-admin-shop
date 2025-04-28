import type { AuthResponse, User } from "../types";
import { tesloApi } from "@/api/tesloApi";
import { isAxiosError } from "axios";

interface loginError {
  ok: false
  message: string
}

interface LoginSuccess {
  ok: true
  user: User
  token: string
}

export async function login(email: string, password: string): Promise<LoginSuccess | loginError> {
  try {
    const { data } = await tesloApi.post<AuthResponse>("/auth/login", { email, password });

    return {
      ok: true,
      user: data.user,
      token: data.token,
    };
  } catch (error) {
    if (isAxiosError(error) && error.response?.status === 401) {
      return {
        ok: false,
        message: "Invalid credentials",
      };
    }
    console.log("Error in login:", error);
    throw new Error("An unexpected error occurred");
  }
}
