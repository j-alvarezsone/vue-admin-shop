<script setup lang="ts">
import Button from "@/features/shared/components/ui/Button.vue";
import InputEmail from "@/features/shared/components/ui/form/InputEmail.vue";
import InputPassword from "@/features/shared/components/ui/form/InputPassword.vue";
import InputText from "@/features/shared/components/ui/form/InputText.vue";
import { toTypedSchema } from "@vee-validate/zod";
import { useForm } from "vee-validate";
import { useToast } from "vue-toastification";
import { z } from "zod";
import { useAuthActions } from "../stores/auth";

interface Form {
  fullName: string
  email: string
  password: string
}

const { register } = useAuthActions();
const toast = useToast();

const schema = z.object({
  fullName: z.string().min(2, "Full name must be at least 2 characters"),
  email: z.string().email("Invalid email"),
  password: z.string().min(6, "Password must be at least 6 characters"),
});

const { handleSubmit, meta } = useForm<Form>({
  initialValues: {
    fullName: "",
    email: "",
    password: "",
  },
  validationSchema: toTypedSchema(schema),
});

const onSubmit = handleSubmit(async (values) => {
  const { ok, message } = await register(values.fullName, values.email, values.password);

  if (ok) { return; }

  toast.error(message);
});
</script>

<template>
  <h1 class="text-2xl font-semibold mb-4">
    Register
  </h1>
  <form class="space-y-4" @submit.prevent="onSubmit">
    <InputText
      label="name"
      name="fullName"
      placeholder="Enter your name"
    />
    <InputEmail
      name="email"
      label="email"
      placeholder="Enter your email"
    />
    <InputPassword
      name="password"
      label="password"
      placeholder="Enter your password"
    />
    <Button
      type="submit"
      class="w-full"
      :disabled="!meta.valid && meta.touched"
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
