<script setup lang="ts">
import Skeleton from "@/features/shared/components/ui/Skeleton.vue";
import { computed } from "vue";

interface Props {
  count?: number
}

const props = withDefaults(defineProps<Props>(), {
  count: 10,
});

const rows = computed(() => Array.from({ length: props.count }));
</script>

<template>
  <tbody class="text-gray-700">
    <tr
      v-for="(_, idx) in rows"
      :key="idx"
      class="even:bg-gray-100 odd:bg-white hover:bg-gray-200"
    >
      <td class="text-left py-3 px-4">
        <Skeleton size="size-10" />
      </td>
      <td class="text-left py-3 px-4">
        <Skeleton width="w-32" height="h-4" />
      </td>
      <td class="text-center py-3 px-4">
        <Skeleton width="w-16" height="h-6" />
      </td>
      <td class="text-left py-3 px-4">
        <Skeleton width="w-24" height="h-4" />
      </td>
    </tr>
  </tbody>
</template>
