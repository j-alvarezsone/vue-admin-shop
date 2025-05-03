<script setup lang="ts">
import type { IconName } from "@/icons/types";
import { computed, useSlots } from "vue";
import BaseIcon from "./Icon.vue";

interface Props {
  icon?: IconName
  iconPos?: "left" | "right"
  size?: "sm" | "md" | "lg"
  variant?: "primary" | "success" | "warning" | "danger" | "neutral"
  iconSize?: string
  label?: string
}

const props = withDefaults(defineProps<Props>(), {
  icon: undefined,
  iconPos: "left",
  size: "md",
  variant: "primary",
  iconSize: "size-3",
  label: undefined,
});

const slots = useSlots();

const style = computed(() => {
  return [
    // Alignments
    "flex items-center justify-center gap-2 w-fit",
    // Shapes
    "rounded-2xl",
    // Sizes & Spacing
    { "py-0.5 px-2 text-xs": props.size === "sm" && (props.label || !!slots.default) },
    { "py-0.5 px-2.5": props.size === "md" && (props.label || !!slots.default) },
    { "py-1 px-3": props.size === "lg" && (props.label || !!slots.default) },
    { "py-0.5 pl-1.5 pr-2": props.size === "sm" && props.icon && props.iconPos === "left" && (props.label || !!slots.default) },
    { "py-0.5 pl-2 pr-1.5": props.size === "sm" && props.icon && props.iconPos === "right" && (props.label || !!slots.default) },
    { "py-0.5 pl-2 pr-2.5": props.size === "md" && props.icon && props.iconPos === "left" && (props.label || !!slots.default) },
    { "py-0.5 pl-2.5 pr-2": props.size === "md" && props.icon && props.iconPos === "right" && (props.label || !!slots.default) },
    { "py-0.5 pl-2.5 pr-3": props.size === "lg" && props.icon && props.iconPos === "left" && (props.label || !!slots.default) },
    { "py-0.5 pl-3 pr-2.5": props.size === "lg" && props.icon && props.iconPos === "right" && (props.label || !!slots.default) },
    // --- Variants ---
    { "bg-blue-100 text-blue-700 border border-blue-700/5": props.variant === "primary" },
    { "bg-green-100 text-green-700 border border-green-700/5": props.variant === "success" },
    { "bg-yellow-100 text-yellow-700 border border-yellow-700/5": props.variant === "warning" },
    { "bg-red-100 text-red-700 border border-red-700/5": props.variant === "danger" },
    { "bg-gray-100 text-gray-700 border border-gray-700/5": props.variant === "neutral" },
  ];
});

const iconStyle = computed(() => {
  return [
    // alignment
    {
      "order-1": props.iconPos === "right",
    },
    // sizes
    props.iconSize,
  ];
});
</script>

<template>
  <div :class="style">
    <div v-if="icon" class="grid place-content-center" :class="iconStyle">
      <BaseIcon :name="icon" class="shrink-0" />
    </div>
    <slot>
      {{ label }}
    </slot>
  </div>
</template>
