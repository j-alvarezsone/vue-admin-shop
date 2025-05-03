<script lang="ts" setup>
import Button from "@/features/shared/components/ui/Button.vue";
import InputCheckbox from "@/features/shared/components/ui/form/InputCheckbox.vue";
import InputEmail from "@/features/shared/components/ui/form/InputEmail.vue";
import InputPassword from "@/features/shared/components/ui/form/InputPassword.vue";
import { toTypedSchema } from "@vee-validate/zod";
import { useForm } from "vee-validate";
import { watchEffect } from "vue";
import { useToast } from "vue-toastification";
import { z } from "zod";
import { useAuthActions } from "../stores/auth";

interface Form {
  email: string
  password: string
  remember: boolean
}

const { login } = useAuthActions();
const toast = useToast();

const schema = z.object({
  email: z.string().email("Invalid email"),
  password: z.string().min(6, "Password must be at least 6 characters"),
  remember: z.boolean(),
});

const { values, setFieldValue, handleSubmit, meta } = useForm<Form>({
  initialValues: {
    email: localStorage.getItem("email") || "",
    password: "",
    remember: false,
  },
  validationSchema: toTypedSchema(schema),
});

const onSubmit = handleSubmit(async (values) => {
  if (values.remember) {
    localStorage.setItem("email", values.email);
  } else {
    localStorage.removeItem("email");
  }

  const ok = await login(values.email, values.password);

  if (ok) { return; }

  toast.error("Invalid email or password");
});

watchEffect(() => {
  if (values.email) {
    setFieldValue("remember", true);
  }
});
</script>

<template>
  <h1 class="text-2xl font-semibold mb-4">
    Login
  </h1>
  <form class="space-y-4" @submit.prevent="onSubmit">
    <InputEmail
      name="email"
      label="Email"
      placeholder="Email"
    />
    <InputPassword
      name="password"
      label="password"
      placeholder="Password"
    />
    <InputCheckbox name="remember" :checked-value="true" label="Remember User" />
    <Button
      class="w-full"
      type="submit"
      :disabled="!meta.valid && meta.touched"
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
