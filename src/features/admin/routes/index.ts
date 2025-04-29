import type { RouteRecordRaw } from "vue-router";

export const adminRoutes: RouteRecordRaw = {
  path: "/admin",
  component: () => import("@/features/admin/layouts/AdminLayout.vue"),
};
