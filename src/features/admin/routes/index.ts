import type { RouteRecordRaw } from "vue-router";
import isAdminGuard from "@/features/auth/guards/is-admin.guard";

export const adminRoutes: RouteRecordRaw = {
  path: "/admin",
  name: "admin",
  beforeEnter: [isAdminGuard],
  redirect: { name: "admin-products" },
  component: () => import("@/features/admin/layouts/AdminLayout.vue"),
  children: [
    {
      path: "products",
      name: "admin-products",
      component: () => import("@/features/admin/views/ProductsView.vue"),
    },
    {
      path: "products/:productId",
      name: "admin-product",
      component: () => import("@/features/admin/views/ProductView.vue"),
    },
  ],
};
