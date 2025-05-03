<script lang="ts" setup>
import Button from "@/features/shared/components/ui/Button.vue";
import InputEmail from "@/features/shared/components/ui/form/InputEmail.vue";
import InputPassword from "@/features/shared/components/ui/form/InputPassword.vue";
import { reactive, useTemplateRef, watchEffect } from "vue";
import { useToast } from "vue-toastification";
import { useAuthActions } from "../stores/auth";

const { login } = useAuthActions();
const toast = useToast();
const form = reactive({
  email: "",
  password: "",
  remember: false,
});

const emailInputRef = useTemplateRef("emailInputRef");
const passwordInputRef = useTemplateRef("passwordInputRef");

async function onLogin() {
  if (form.email === "") {
    return (emailInputRef.value?.$refs.inputRef as HTMLInputElement | undefined)?.focus();
  }

  if (form.password.length < 6) {
    return (passwordInputRef.value?.$refs.inputRef as HTMLInputElement | undefined)?.focus();
  }

  if (form.remember) {
    localStorage.setItem("email", form.email);
  } else {
    localStorage.removeItem("email");
  }

  const ok = await login(form.email, form.password);

  if (ok) { return; }

  toast.error("Invalid email or password");
}

watchEffect(() => {
  const email = localStorage.getItem("email");
  if (email) {
    form.email = email;
    form.remember = true;
  }
});
</script>

<template>
  <h1 class="text-2xl font-semibold mb-4">
    Login
  </h1>
  <form class="space-y-4" @submit.prevent="onLogin">
    <InputEmail
      ref="emailInputRef"
      v-model="form.email"
      name="email"
      label="Email"
      placeholder="Email"
    />
    <InputPassword
      ref="passwordInputRef"
      v-model="form.password"
      name="password"
      label="password"
      placeholder="Password"
    />
    <div class="mb-4 flex items-center">
      <input id="remember" v-model="form.remember" type="checkbox" name="remember" class="text-blue-500">
      <label for="remember" class="text-gray-600 ml-2">Remember User</label>
    </div>
    <div class="mb-6 text-blue-500">
      <a href="#" class="hover:underline">Forgot Password?</a>
    </div>
    <Button
      class="w-full"
      type="submit"
    >
      Login
    </Button>
  </form>
  <div class="mt-6 text-blue-500 text-center">
    <RouterLink :to="{ name: 'register' }" class="hover:underline underline-offset-4">
      Sign up Here
    </RouterLink>
  </div>
</template>
