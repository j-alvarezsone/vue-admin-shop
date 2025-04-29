import type { AuthResponse, User } from "../types";
import { tesloApi } from "@/api/tesloApi";

interface RegisterError {
  ok: false
  message: string
}

interface RegisterSuccess {
  ok: true
  user: User
  token: string
}

export async function registerAction(fullName: string, email: string, password: string): Promise<RegisterSuccess | RegisterError> {
  try {
    const { data } = await tesloApi.post<AuthResponse>("/auth/register", {
      fullName,
      email,
      password,
    });

    return {
      ok: true,
      user: data.user,
      token: data.token,
    };
  } catch (error) {
    console.log("Error in register:", error);
    return {
      ok: false,
      message: "Cannot register user",
    };
  }
}
