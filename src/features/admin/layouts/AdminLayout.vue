<script setup lang="ts">
import Button from "@/features/shared/components/ui/Button.vue";
import { RouterView } from "vue-router";
import { useAuthState } from "../../auth/stores/auth";

const { userName } = useAuthState();

const navigation = [
  {
    to: "/",
    label: "Home",
  },
  {
    to: "/admin/products",
    label: "Products",
  },
];
</script>

<template>
  <div class="flex w-screen h-screen text-gray-700">
    <div class="flex flex-col w-56 border-r border-gray-300">
      <div class="flex flex-col flex-grow p-4 overflow-auto">
        <RouterLink v-for="nav in navigation" :key="nav.label" :to="nav.to" active-class="active-class" class="flex items-center flex-shrink-0 h-10 px-2 text-sm font-medium rounded hover:bg-gray-300/60" href="#">
          <span class="leading-none">{{ nav.label }}</span>
        </RouterLink>
        <RouterLink to="/admin/products/create" class="mt-auto">
          <Button icon="plus" variant="secondary">
            New Product
          </Button>
        </RouterLink>
      </div>
    </div>
    <div class="flex flex-col flex-grow">
      <div class="flex items-center flex-shrink-0 h-16 px-8 border-b border-gray-300">
        <h1 class="text-lg font-medium">
          {{ userName }}
        </h1>
      </div>
      <div class="flex-grow p-6 overflow-auto bg-gray-200">
        <RouterView />
      </div>
    </div>
  </div>
</template>
