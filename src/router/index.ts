import { authRoutes } from "@/features/auth/routes";
import { createRouter, createWebHistory } from "vue-router";
import ShopLayout from "../layouts/ShopLayout.vue";

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: "/",
      name: "shop",
      component: ShopLayout,
      children: [
        {
          path: "",
          name: "home",
          component: () => import("@/features/shop/views/HomeView.vue"),
        },
      ],
    },
    authRoutes,
  ],
});

export default router;
