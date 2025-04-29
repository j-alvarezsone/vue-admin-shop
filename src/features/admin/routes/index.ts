import type { RouteRecordRaw } from "vue-router";
import isAdminGuard from "@/features/auth/guards/is-admin.guard";

export const adminRoutes: RouteRecordRaw = {
  path: "/admin",
  name: "admin",
  beforeEnter: [isAdminGuard],
  component: () => import("@/features/admin/layouts/AdminLayout.vue"),
};
