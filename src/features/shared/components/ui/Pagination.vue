<script setup lang="ts">
import Button from "./Button.vue";

interface Props {
  page: number
  hasMoreData: boolean
}

defineProps<Props>();
</script>

<template>
  <div class="flex justify-center py-10 bg-gray-100 space-x-3">
    <Button
      icon="chevron-left"
      icon-size="size-5"
      :disabled="page === 1"
      @click="$router.push({ query: { page: page - 1 } })"
    >
      Previews
    </Button>
    <Button
      icon="chevron-right"
      icon-pos="right"
      icon-size="size-5"
      :disabled="hasMoreData"
      @click="$router.push({ query: { page: page + 1 } })"
    >
      Next
    </Button>
  </div>
</template>
