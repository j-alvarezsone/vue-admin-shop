<script setup lang="ts">
import { VueQueryDevtools } from "@tanstack/vue-query-devtools";
import { RouterView, useRoute, useRouter } from "vue-router";
import { useAuthActions } from "./features/auth/stores/auth";
import { AUTH_STATUS } from "./features/auth/types/auth-status";

const { $subscribe, checkAuthStatus } = useAuthActions();
const router = useRouter();
const route = useRoute();

$subscribe((_, state) => {
  if (state.authStatus === AUTH_STATUS.Checking) {
    checkAuthStatus();
    return;
  }

  if (route.path.includes("/auth") && state.authStatus === AUTH_STATUS.Authenticated) {
    router.replace({ name: "home" });
    return;
  }
}, { immediate: true });
</script>

<template>
  <RouterView />
  <VueQueryDevtools />
</template>
