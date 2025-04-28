<script setup lang="ts">
import { computed } from "vue";

interface Props {
  width?: string
  height?: string
  shape?: "rectangle" | "circle"
  size?: string | null
}

const props = withDefaults(defineProps<Props>(), {
  width: "w-full",
  height: "h-4",
  size: null,
  shape: "rectangle",
});

const style = computed(() => {
  const width = props.size || props.width;
  const height = props.size || props.height;

  return [
    "animate-pulse bg-slate-200",
    props.shape === "circle" ? "rounded-full" : "rounded",
    width,
    height,
  ];
});
</script>

<template>
  <div
    class="animate-pulse bg-slate-200"
    :class="style"
  />
</template>
