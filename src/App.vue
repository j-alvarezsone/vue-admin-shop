<script setup lang="ts">
import { VueQueryDevtools } from "@tanstack/vue-query-devtools";
import { RouterView } from "vue-router";
import { useAuthState } from "./features/auth/stores/auth";
import Loader from "./features/shared/components/Loader.vue";

const { isChecking, token } = useAuthState();
</script>

<template>
  <div v-if="isChecking && token" class="centered h-screen">
    <Loader />
  </div>
  <RouterView v-else />
  <VueQueryDevtools />
</template>
