import type { RouteRecordRaw } from "vue-router";

export const authRoutes: RouteRecordRaw = {
  path: "/auth",
  name: "auth",
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
