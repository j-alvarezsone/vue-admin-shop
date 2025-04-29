<script setup lang="ts">
import Button from "@/features/shared/components/Button.vue";
import { reactive, useTemplateRef } from "vue";
import { useToast } from "vue-toastification";
import { useAuthActions } from "../stores/auth";

const { register } = useAuthActions();
const toast = useToast();

const fullNameInputRef = useTemplateRef("fullNameInputRef");
const emailInputRef = useTemplateRef("emailInputRef");
const passwordInputRef = useTemplateRef("passwordInputRef");

const form = reactive({
  fullName: "",
  email: "",
  password: "",
});

async function onRegister() {
  if (form.fullName.length < 2) {
    return fullNameInputRef.value?.focus();
  }

  if (form.email === "") {
    return emailInputRef.value?.focus();
  }

  if (form.password.length < 6) {
    return passwordInputRef.value?.focus();
  }

  const { ok, message } = await register(form.fullName, form.email, form.password);

  if (ok) { return; }

  toast.error(message);
}
</script>

<template>
  <h1 class="text-2xl font-semibold mb-4">
    Register
  </h1>
  <form @submit.prevent="onRegister">
    <div class="mb-4">
      <label for="name" class="block text-gray-600">Name</label>
      <input
        id="name"
        ref="fullNameInputRef"
        v-model="form.fullName"
        type="text"
        name="name"
        class="w-full border border-gray-300 rounded-md py-2 px-3 focus:outline-none focus:border-blue-500"
        autocomplete="off"
      >
    </div>

    <div class="mb-4">
      <label for="email" class="block text-gray-600">Email</label>
      <input
        id="email"
        ref="emailInputRef"
        v-model="form.email"
        type="text"
        name="email"
        class="w-full border border-gray-300 rounded-md py-2 px-3 focus:outline-none focus:border-blue-500"
        autocomplete="off"
      >
    </div>

    <div class="mb-4">
      <label for="password" class="block text-gray-600">Password</label>
      <input
        id="password"
        ref="passwordInputRef"
        v-model="form.password"
        type="password"
        name="password"
        class="w-full border border-gray-300 rounded-md py-2 px-3 focus:outline-none focus:border-blue-500"
        autocomplete="off"
      >
    </div>

    <div class="mb-6 text-blue-500">
      <a href="#" class="hover:underline">Forgot Password?</a>
    </div>

    <Button
      type="submit"
      class="w-full"
    >
      Sign Up
    </Button>
  </form>

  <div class="mt-6 text-blue-500 text-center">
    <RouterLink :to="{ name: 'login' }" class="hover:underline">
      Login Here
    </RouterLink>
  </div>
</template>
