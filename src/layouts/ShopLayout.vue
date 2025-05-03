<script setup lang="ts">
import Footer from "../features/shared/components/Footer.vue";
import Menubar from "../features/shared/components/Menubar.vue";
</script>

<template>
  <div class="flex flex-col flex-1">
    <Menubar />
    <div class="flex flex-col flex-1">
      <RouterView />
    </div>
    <Footer />
  </div>
</template>
