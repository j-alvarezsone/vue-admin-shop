<script setup lang="ts">
import type { IconName } from "@/icons/types";
import { clsx } from "clsx";
import { twMerge } from "tailwind-merge";
import { computed, useTemplateRef } from "vue";
import Icon from "./Icon.vue";
import Loader from "./Loader.vue";

interface Props {
  class?: string
  type?: "button" | "submit" | "reset"
  disabled?: boolean
  size?: "sm" | "md" | "lg" | "xl" | "2xl"
  variant?: "primary" | "secondary" | "tertiary" | "danger" | "transparent"
  icon?: IconName
  iconPos?: "left" | "right"
  iconSize?: string
  loading?: boolean
  outlined?: boolean
  text?: boolean
  link?: boolean
  ripple?: boolean
  rippleBgColor?: string
  rounded?: boolean
}

const {
  class: customClass = "",
  type = "button",
  disabled = false,
  size = "md",
  variant = "primary",
  icon = undefined,
  iconPos = "left",
  iconSize = undefined,
  loading = false,
  outlined = false,
  text = false,
  link = false,
  ripple = true,
  rippleBgColor = undefined,
  rounded = false,
} = defineProps<Props>();

const btnRef = useTemplateRef("btnRef");
const hasLabel = computed(() => !!btnRef.value?.textContent);
const ariaLabel = computed(() => {
  if (!hasLabel.value && icon)
    return icon;

  return btnRef.value?.textContent ?? "";
});
const style = computed(() => {
  return [
    // Alignments
    "inline-flex items-center justify-center text-center overflow-hidden gap-2 whitespace-nowrap grouped-button",
    // Shapes
    { "rounded-lg": !rounded },
    { "rounded-full": rounded },
    // Sizes & Spacing
    {
      "h-9 px-3.5": size === "sm" && hasLabel.value,
      "h-10 px-4": size === "md" && hasLabel.value,
      "h-11 px-4.5 text-base": size === "lg" && hasLabel.value,
      "h-12 px-5 text-base": size === "xl" && hasLabel.value,
      "h-15 px-7 text-lg": size === "2xl" && hasLabel.value,
    },
    // Icon only & Spacing
    {
      "size-9": size === "sm" && !hasLabel.value,
      "size-10": size === "md" && !hasLabel.value,
      "size-11": size === "lg" && !hasLabel.value,
      "size-12": size === "xl" && !hasLabel.value,
      "size-14": size === "2xl" && !hasLabel.value,
    },
    // --- Severity Button States ---
    "focus:outline-hidden focus:outline-offset-0 focus:ring-3",
    // --- Variants ---
    // Primary
    {
      "bg-blue-600 text-white hover:bg-blue-700 focus:ring-blue-300/50":
        variant === "primary" && !disabled && !loading && !outlined && !text && !link,
    },
    // Secondary
    {
      "bg-yellow-500 hover:bg-yellow-600 focus:ring-yellow-300/50":
        variant === "secondary" && !disabled && !loading && !outlined && !text && !link,
    },
    // Tertiary
    {
      "bg-gray-900/90 text-white hover:bg-gray-950 focus:ring-gray-400/50":
        variant === "tertiary" && !disabled && !loading && !outlined && !text && !link,
    },
    // Danger
    {
      "bg-error-600 text-white hover:bg-error-700 focus:ring-error-300/50":
        variant === "danger" && !disabled && !loading && !outlined && !text && !link,
    },
    // Transparent
    {
      "bg-transparent focus:ring-blue-500/50": variant === "transparent" && !disabled && !loading,
    },
    // --- Outlined ---
    // Primary
    {
      "bg-blue-50 text-blue-700 border border-blue-700 hover:bg-blue-100 focus:ring-blue-300/50":
        variant === "primary" && !disabled && !loading && outlined,
    },
    // Secondary
    {
      "bg-yellow-50 text-yellow-500 border border-yellow-500 hover:bg-yellow-100 focus:ring-yellow-300/50":
        variant === "secondary" && !disabled && !loading && outlined,
    },
    // Tertiary
    {
      "bg-white text-gray-700 border border-gray-300 hover:bg-gray-200/20  hover:text-gray-800 focus:ring-gray-300/50":
        variant === "tertiary" && !disabled && !loading && outlined,
    },
    // Danger
    {
      "bg-white text-error-700 border border-error-300 hover:bg-error-50 hover:text-error-800 focus:ring-error-300/50":
        variant === "danger" && !disabled && !loading && outlined,
    },
    // --- Text ---
    // Primary
    {
      "text-blue-700 hover:bg-blue-50 focus:ring-blue-300/50":
        variant === "primary" && !disabled && !loading && text,
    },
    // Secondary
    {
      "text-yellow-500 hover:bg-yellow-50 focus:ring-yellow-300/50": variant === "secondary" && !disabled && !loading && text,
    },
    // Tertiary
    {
      "text-gray-700 hover:bg-gray-200/20 focus:ring-gray-300/50": variant === "tertiary" && !disabled && !loading && text,
    },
    // Secondary
    {
      "text-red-700 hover:bg-red-50 focus:ring-red-300/50": variant === "danger" && !disabled && !loading && text,
    },
    // --- Link ---
    {
      "hover:underline underline-offset-2": link,
    },
    // Primary
    {
      "text-blue-700 focus:ring-blue-300/50": variant === "primary" && !disabled && !loading && link,
    },
    // Secondary
    {
      "text-yellow-500 focus:ring-yellow-300/50": variant === "secondary" && !disabled && !loading && link,
    },
    // Tertiary
    {
      "text-gray-700 focus:ring-gray-300/50": variant === "tertiary" && !disabled && !loading && link,
    },
    // Secondary
    {
      "text-red-700 focus:ring-red-300/50": variant === "danger" && !disabled && !loading && link,
    },
    // Disabled & Loading
    {
      "select-none cursor-not-allowed": disabled || loading,
    },
    {
      "bg-gray-400 text-white": (disabled || loading) && !outlined && !text && !link,
    },
    {
      "border border-gray-200 text-gray-300": (disabled || loading) && outlined,
    },
    {
      "text-gray-300": (disabled || loading) && (text || link),
    },
    // Transitions
    "transition duration-300 ease-in-out",
  ];
});

const mergedClasses = computed(() => twMerge(clsx(style.value, customClass)));

const iconStyle = computed(() => {
  return [
    // Sizes
    {
      "size-5": ["sm", "md", "lg", "xl"].includes(size) && !iconSize,
      "size-6": size === "2xl" && !iconSize,
    },
    iconSize,
  ];
});

const loaderSize = computed(() => {
  if (["lg", "xl", "2xl"].includes(size)) {
    return "md";
  }

  return "sm";
});
</script>

<template>
  <button
    ref="btnRef"
    v-ripple="{ disabled: !ripple, background: rippleBgColor }"
    class="select-none relative"
    :class="mergedClasses"
    :type="type"
    :disabled="disabled || loading"
    :aria-label="ariaLabel"
  >
    <div v-if="loading" class="absolute inset-0 grid place-content-center bg-black/20">
      <Loader :is-text-visible="false" :size="loaderSize" color="dark" />
    </div>
    <div v-if="icon" class="grid place-content-center" :class="[size === '2xl' ? 'size-6' : 'size-5', { 'order-1': iconPos === 'right' && hasLabel }]">
      <Icon :name="icon" :class="iconStyle" />
    </div>
    <slot />
  </button>
</template>
