import type { NavigationGuardNext, RouteLocationNormalized } from "vue-router";
import { useAuthActions, useAuthState } from "../stores/auth";
import { AUTH_STATUS } from "../types";

async function isNotAuthenticatedGuard(to: RouteLocationNormalized, from: RouteLocationNormalized, next: NavigationGuardNext) {
  const { authStatus } = useAuthState();
  const { checkAuthStatus } = useAuthActions();

  await checkAuthStatus();

  if (authStatus.value === AUTH_STATUS.Authenticated) {
    return next({ name: "home" });
  }

  return next();
}

export default isNotAuthenticatedGuard;
