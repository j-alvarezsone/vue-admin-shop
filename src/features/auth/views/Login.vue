<script lang="ts" setup>
import { useRouter } from "vue-router";

const router = useRouter();

function onLogin() {
  localStorage.setItem("userId", "ABC-123");

  const lastPath = localStorage.getItem("lastPath") ?? "/";

  router.replace(lastPath);
}
</script>

<template>
  <h1 class="text-2xl font-semibold mb-4">
    Login
  </h1>
  <form action="#" method="POST">
    <div class="mb-4">
      <label for="username" class="block text-gray-600">Username</label>
      <input
        id="username"
        type="text"
        name="username"
        class="w-full border border-gray-300 rounded-md py-2 px-3 focus:outline-none focus:border-blue-500"
        autocomplete="off"
      >
    </div>
    <div class="mb-4">
      <label for="password" class="block text-gray-600">Password</label>
      <input
        id="password"
        type="password"
        name="password"
        class="w-full border border-gray-300 rounded-md py-2 px-3 focus:outline-none focus:border-blue-500"
        autocomplete="off"
      >
    </div>
    <div class="mb-4 flex items-center">
      <input id="remember" type="checkbox" name="remember" class="text-blue-500">
      <label for="remember" class="text-gray-600 ml-2">Remember Me</label>
    </div>
    <div class="mb-6 text-blue-500">
      <a href="#" class="hover:underline">Forgot Password?</a>
    </div>
    <button
      type="button"
      class="bg-blue-500 hover:bg-blue-600 text-white font-semibold rounded-md py-2 px-4 w-full"
      @click="onLogin"
    >
      Login
    </button>
  </form>
  <div class="mt-6 text-blue-500 text-center">
    <RouterLink :to="{ name: 'register' }" class="hover:underline">
      Sign up Here
    </RouterLink>
  </div>
</template>
