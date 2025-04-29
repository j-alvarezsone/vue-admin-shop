import type { NavigationGuardNext, RouteLocationNormalized } from "vue-router";
import { useAuthState } from "../stores/auth";

async function isAdminGuard(to: RouteLocationNormalized, from: RouteLocationNormalized, next: NavigationGuardNext) {
  const { isAdmin } = useAuthState();

  if (!isAdmin.value) {
    return next({ name: "home" });
  }

  return next();
}

export default isAdminGuard;
