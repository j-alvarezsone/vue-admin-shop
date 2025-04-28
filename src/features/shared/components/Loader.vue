<script lang="ts" setup>
import { computed } from "vue";

interface Props {
  size?: "sm" | "md" | "lg" | "xl"
  color?: "light" | "dark" | "neutral"
  isTextVisible?: boolean
}

const {
  size = "lg",
  color = "light",
  isTextVisible = true,
} = defineProps<Props>();

const style = computed(() => {
  return [
    "border border-solid",
    { "size-4": size === "sm" },
    { "size-6": size === "md" },
    { "size-10": size === "lg" },
    { "size-12": size === "xl" },
    { "border-blue-500": color === "light" },
    { "border-neutral-100": color === "dark" },
    { "border-gray-300": color === "neutral" },
  ];
});

const textStyle = computed(() => {
  return [
    { "text-sm": size === "sm" },
    { "text-base": size === "md" },
    { "text-2xl": size === "lg" },
    { "text-3xl": size === "xl" },
    { "text-blue-500": color === "light" },
    { "text-neutral-100": color === "dark" },
    { "text-gray-300": color === "neutral" },
  ];
});
</script>

<template>
  <div class="flex items-center justify-center">
    <div v-if="isTextVisible" class="wavy mr-2" :class="textStyle">
      <span style="--i: 1">L</span>
      <span style="--i: 2">o</span>
      <span style="--i: 3">a</span>
      <span style="--i: 4">d</span>
      <span style="--i: 5">i</span>
      <span style="--i: 6">n</span>
      <span style="--i: 7">g</span>
    </div>
    <div
      style="border-top-color: transparent"
      :class="style"
      class="rounded-full animate-spin"
    />
  </div>
</template>

<style scoped>
  .wavy {
    position: relative;
    -webkit-box-reflect: below -12px linear-gradient(transparent, rgba(255, 252, 252, 0.2));
  }
  .dark .wavy {
    position: relative;
    -webkit-box-reflect: below -12px linear-gradient(transparent, rgb(255, 255, 255));
  }

  .wavy span {
    position: relative;
    display: inline-block;
    text-transform: uppercase;
    animation: animate 1s ease-in-out infinite;
    animation-delay: calc(0.1s * var(--i));
  }

  @keyframes animate {
    0% {
      transform: translateY(0);
    }
    20% {
      transform: translateY(-10px);
    }
    40%,
    100% {
      transform: translateY(0);
    }
  }
</style>
