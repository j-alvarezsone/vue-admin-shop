import type { ObjectValues } from "@/features/shared/types";
import type { AUTH_STATUS } from "../constants/auth";

export type AuthStatus = ObjectValues<typeof AUTH_STATUS>;
