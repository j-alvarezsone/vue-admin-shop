<script setup lang="ts">
import Footer from "../features/shared/components/Footer.vue";
import Menubar from "../features/shared/components/Menubar.vue";
</script>

<template>
  <Menubar />

  <RouterView />

  <Footer />
</template>
