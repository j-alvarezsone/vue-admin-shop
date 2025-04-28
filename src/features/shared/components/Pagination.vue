<script setup lang="ts">
import ChevronLeftIcon from "@/icons/ChevronLeftIcon.vue";
import ChevronRightIcon from "@/icons/ChevronRightIcon.vue";

interface Props {
  page: number
  hasMoreData: boolean
}

defineProps<Props>();
</script>

<template>
  <div class="flex justify-center py-10 bg-gray-100 space-x-3">
    <button
      class="flex justify-center items-center space-x-1.5 rounded-lg px-4 py-1.5 text-white bg-blue-500 disabled:bg-gray-300 hover:bg-blue-600 transition-all"
      :disabled="page === 1"
      @click="$router.push({ query: { page: page - 1 } })"
    >
      <ChevronLeftIcon class="size-5" />
      <span>Previews</span>
    </button>

    <button
      class="flex justify-center items-center space-x-1.5 rounded-lg px-4 py-1.5 text-white bg-blue-500 disabled:bg-gray-300 hover:bg-blue-600 transition-all"
      :disabled="hasMoreData"
      @click="$router.push({ query: { page: page + 1 } })"
    >
      <span>Next</span>
      <ChevronRightIcon class="size-5" />
    </button>
  </div>
</template>
