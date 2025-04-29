import type { RouteRecordRaw } from "vue-router";
import isNotAuthenticatedGuard from "../guards/is-not-authenticated.guard";

export const authRoutes: RouteRecordRaw = {
  path: "/auth",
  name: "auth",
  beforeEnter: [isNotAuthenticatedGuard],
  component: () => import("@/features/auth/layouts/AuthLayout.vue"),
  redirect: { name: "login" },
  children: [
    {
      path: "login",
      name: "login",
      component: () => import("@/features/auth/views/Login.vue"),
    },
    {
      path: "register",
      name: "register",
      component: () => import("@/features/auth/views/Register.vue"),
    },
  ],
};
