import type { ObjectValues } from "@/features/shared/types";

export const AUTH_STATUS = {
  Authenticated: "authenticated",
  Unauthenticated: "unauthenticated",
  Checking: "checking",
} as const;

export type AuthStatus = ObjectValues<typeof AUTH_STATUS>;
