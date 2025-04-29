<script setup lang="ts">
import Button from "./Button.vue";
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
        <!-- Login Button -->
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
        <Button class="md:hidden" icon="hamburger" variant="transparent">
          <span class="sr-only">Open main menu</span>
        </Button>
      </div>
      <div id="navbar-sticky" class="hidden w-full items-center justify-between md:order-1 md:flex md:w-auto">
        <ul class="mt-4 flex flex-col rounded-lg border border-gray-100 bg-gray-50 p-4 md:mt-0 md:flex-row md:space-x-8 md:border-0 md:bg-white md:text-sm md:font-medium">
          <li>
            <a href="#" class="block rounded bg-blue-700 py-2 pl-3 pr-4 text-white md:bg-transparent md:p-0 md:text-blue-700" aria-current="page">Home</a>
          </li>
          <li>
            <a href="#" class="block rounded py-2 pl-3 pr-4 text-gray-700 hover:bg-gray-100 md:p-0 md:hover:bg-transparent md:hover:text-blue-700">About</a>
          </li>
          <li>
            <a href="#" class="block rounded py-2 pl-3 pr-4 text-gray-700 hover:bg-gray-100 md:p-0 md:hover:bg-transparent md:hover:text-blue-700">Services</a>
          </li>
          <li>
            <a href="#" class="block rounded py-2 pl-3 pr-4 text-gray-700 hover:bg-gray-100 md:p-0 md:hover:bg-transparent md:hover:text-blue-700">Contact</a>
          </li>
        </ul>
      </div>
    </div>
  </nav>
</template>
