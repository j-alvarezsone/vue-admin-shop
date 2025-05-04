import { adminRoutes } from "@/features/admin/routes";
import { AUTH_STATUS } from "@/features/auth/constants/auth";
import { authRoutes } from "@/features/auth/routes";
import { useAuthActions, useAuthState } from "@/features/auth/stores/auth";
import ShopLayout from "@/features/shop/layouts/ShopLayout.vue";
import { createRouter, createWebHistory } from "vue-router";

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
    adminRoutes,
  ],
});

export default router;

router.beforeEach(async (to, _, next) => {
  const { token, authStatus, user } = useAuthState();
  const { checkAuthStatus } = useAuthActions();

  if (!token.value && to.path.startsWith("/auth")) {
    return next();
  }

  if (!token.value) {
    return next({ name: "login" });
  }

  if (to.path.startsWith("/auth") && authStatus.value === AUTH_STATUS.Authenticated) {
    return next({ name: "home" });
  }

  if (!user.value && token.value) {
    await checkAuthStatus();
    if (to.path.startsWith("/auth")) {
      return next({ name: "home" });
    }

    return next();
  }

  next();
});
