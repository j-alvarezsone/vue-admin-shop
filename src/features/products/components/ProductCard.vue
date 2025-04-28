<script setup lang="ts">
import type { Product } from "../types/product";
import Button from "@/features/shared/components/Button.vue";

interface Props {
  product: Product
}

defineProps<Props>();
</script>

<template>
  <article class="rounded-xl bg-white p-3 shadow-lg hover:shadow-xl hover:transform hover:scale-105 duration-300 ">
    <a href="#">
      <div class="relative flex items-end overflow-hidden rounded-xl">
        <img :src="product.images[0]" :alt="product.title" class="w-full h-[250px] object-fit lg:object-cover">
      </div>
      <div class="mt-1 p-2">
        <h2 class="text-slate-700">{{ product.title }}</h2>
        <p class="mt-1 text-sm text-slate-400 capitalize">{{ product.gender }}</p>

        <div class="mt-3 flex items-end justify-between">
          <p class="text-lg font-bold text-blue-500">${{ product.price }}</p>
          <Button icon="cart" size="sm">Add to cart</Button>
        </div>
      </div>
    </a>
  </article>
</template>
