<script setup lang="ts">
import Skeleton from "@/features/shared/components/Skeleton.vue";
import { computed } from "vue";

interface Props {
  count?: number
}

const props = withDefaults(defineProps<Props>(), {
  count: 8,
});

const rows = computed(() => Array.from({ length: props.count }));
</script>

<template>
  <section class="py-10 bg-gray-100">
    <div class="mx-auto grid max-w-6xl grid-cols-1 gap-6 p-6 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
      <article
        v-for="(_, idx) in rows"
        :key="idx"
        class="rounded-xl bg-white p-3 shadow-lg hover:shadow-xl hover:transform hover:scale-105 duration-300"
      >
        <div class="relative flex items-end overflow-hidden rounded-xl">
          <Skeleton width="w-full" height="h-48" />
        </div>
        <div class="mt-1 p-2 space-y-2">
          <Skeleton height="h-5" />
          <Skeleton width="w-1/2" height="h-4" />
          <div class="mt-3 flex items-end justify-between">
            <Skeleton width="w-20" height="h-6" />
            <Skeleton size="w-24" height="h-8" />
          </div>
        </div>
      </article>
    </div>
  </section>
</template>
