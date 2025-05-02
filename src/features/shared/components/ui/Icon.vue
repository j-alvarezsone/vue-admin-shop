<script lang="ts" setup>
import type { IconName } from "@/icons/types";
import { computed, defineAsyncComponent } from "vue";

const props = defineProps<{
  name: IconName
}>();

const iconComponent = computed(() => {
  if (props.name) {
    return defineAsyncComponent(() => import(`@/icons/${props.name}.vue`));
  }

  return "";
});
</script>

<template>
  <component :is="iconComponent" v-if="iconComponent" />
</template>
