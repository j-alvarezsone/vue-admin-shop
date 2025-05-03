<script setup lang="ts">
import { getProductsAction } from "@/features/products/actions";
import ProductList from "@/features/products/components/ProductList.vue";
import ProductListSkeleton from "@/features/products/components/ProductListSkeleton.vue";
import Pagination from "@/features/shared/components/ui/Pagination.vue";
import usePagination from "@/features/shared/composables/usePagination";

import { useQuery, useQueryClient } from "@tanstack/vue-query";
import { watchEffect } from "vue";

const queryClient = useQueryClient();
const { page } = usePagination();

const { data: products, isLoading } = useQuery({
  queryKey: ["products", { page }],
  queryFn: () => getProductsAction(page.value),
});

watchEffect(() => {
  queryClient.prefetchQuery({
    queryKey: ["products", { page: page.value + 1 }],
    queryFn: () => getProductsAction(page.value + 1),
  });
});
</script>

<template>
  <div>
    <div class="pt-32 bg-gray-100">
      <h1 class="text-center text-2xl font-bold text-gray-800">
        All Products
      </h1>
    </div>
    <ProductListSkeleton v-if="isLoading" />
    <ProductList v-else-if="products?.length" :products />
    <Pagination
      :has-more-data="!!products && products.length < 10"
      :page
    />
  </div>
</template>
