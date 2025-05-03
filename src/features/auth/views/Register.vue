<script setup lang="ts">
import Button from "@/features/shared/components/ui/Button.vue";
import InputEmail from "@/features/shared/components/ui/form/InputEmail.vue";
import InputPassword from "@/features/shared/components/ui/form/InputPassword.vue";
import InputText from "@/features/shared/components/ui/form/InputText.vue";
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
    return (fullNameInputRef.value?.$refs.inputRef as HTMLInputElement | undefined)?.focus();
  }

  if (form.email === "") {
    return (emailInputRef.value?.$refs.inputRef as HTMLInputElement | undefined)?.focus();
  }

  if (form.password.length < 6) {
    return (passwordInputRef.value?.$refs.inputRef as HTMLInputElement | undefined)?.focus();
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
  <form class="space-y-4" @submit.prevent="onRegister">
    <InputText
      ref="fullNameInputRef"
      v-model="form.fullName"
      label="name"
      name="fullName"
      placeholder="Enter your name"
    />
    <InputEmail
      ref="emailInputRef"
      v-model="form.email"
      name="email"
      label="email"
      placeholder="Enter your email"
    />
    <InputPassword
      ref="passwordInputRef"
      v-model="form.password"
      name="password"
      label="password"
      placeholder="Enter your password"
    />
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
