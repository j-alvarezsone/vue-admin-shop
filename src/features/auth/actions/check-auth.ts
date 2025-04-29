import type { AuthResponse, User } from "../types";
import { tesloApi } from "@/api/tesloApi";
import { isAxiosError } from "axios";

interface CheckError {
  ok: false
  message: string
}

interface CheckSuccess {
  ok: true
  user: User
  token: string
}

export async function checkAuthAction(): Promise<CheckSuccess | CheckError> {
  try {
    const localToken = localStorage.getItem("token");
    if (localToken && localToken.length < 10) {
      return {
        ok: false,
        message: "Invalid token",
      };
    }
    const { data } = await tesloApi.get<AuthResponse>("auth/check-status");

    return {
      ok: true,
      user: data.user,
      token: data.token,
    };
  } catch (error) {
    if (isAxiosError(error) && error.response?.status === 401) {
      return {
        ok: false,
        message: "Invalid token",
      };
    }

    throw new Error("The session could not be verified");
  }
}
