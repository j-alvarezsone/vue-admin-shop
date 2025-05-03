<script setup lang="ts">
import { useAuthActions, useAuthState } from "@/features/auth/stores/auth";
import Button from "./ui/Button.vue";

const { isAuthenticated, isAdmin } = useAuthState();
const { logout } = useAuthActions();
</script>

<template>
  <nav class="fixed top-0 left-0 z-20 w-full border-b border-gray-200 bg-white py-2.5 px-6 sm:px-4">
    <div class="container mx-auto flex max-w-6xl flex-wrap items-center justify-between">
      <a href="#" class="flex items-center">
        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="mr-3 h-6 text-blue-500 sm:h-9">
          <path stroke-linecap="round" stroke-linejoin="round" d="M21 7.5l-9-5.25L3 7.5m18 0l-9 5.25m9-5.25v9l-9 5.25M3 7.5l9 5.25M3 7.5v9l9 5.25m0-9v9" />
        </svg>

        <span class="self-center whitespace-nowrap text-xl font-semibold">Termcode</span>
      </a>
      <div class="mt-2 sm:mt-0 sm:flex gap-6 md:order-2">
        <template v-if="isAuthenticated">
          <RouterLink v-if="isAdmin" to="/admin">
            <Button class="hidden md:inline-block" size="sm" outlined>
              Admin
            </Button>
          </RouterLink>
          <Button class="hidden md:inline-block" size="sm" @click="logout">
            Logout
          </Button>
        </template>
        <template v-else>
          <RouterLink to="/auth/login">
            <Button class="hidden md:inline-block" size="sm" outlined>
              Login
            </Button>
          </RouterLink>
          <RouterLink to="/auth/register">
            <Button class="hidden md:inline-block" size="sm">
              Register
            </Button>
          </RouterLink>
        </template>
        <Button class="md:hidden" icon="hamburger" variant="transparent">
          <span class="sr-only">Open main menu</span>
        </Button>
      </div>
    </div>
  </nav>
</template>
