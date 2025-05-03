<script setup lang="ts">
import type { Size } from "@/features/products/types/product";
import { getProductsAction } from "@/features/products/actions";
import { deleteProductAction } from "@/features/products/actions/delete-product";
import Badge from "@/features/shared/components/ui/Badge.vue";
import Button from "@/features/shared/components/ui/Button.vue";
import InputSelect from "@/features/shared/components/ui/form/InputSelect.vue";
import InputText from "@/features/shared/components/ui/form/InputText.vue";
import Pagination from "@/features/shared/components/ui/Pagination.vue";
import usePagination from "@/features/shared/composables/usePagination";
import { useMutation, useQuery, useQueryClient } from "@tanstack/vue-query";
import { computed, ref, watchEffect } from "vue";
import { useToast } from "vue-toastification";
import AdminProductsSkeleton from "../components/AdminProductsSkeleton.vue";

const queryClient = useQueryClient();
const { page } = usePagination();
const toast = useToast();

const search = ref<string>("");
const size = ref<Size | "all">("all");
const sizeOptions = [
  { value: "all", label: "All" },
  { value: "XS", label: "XS" },
  { value: "S", label: "S" },
  { value: "M", label: "M" },
  { value: "L", label: "L" },
  { value: "XL", label: "XL" },
  { value: "XXL", label: "XXL" },
];

const { data: products, isLoading, isFetching } = useQuery({
  queryKey: ["products", { page }],
  queryFn: () => getProductsAction(page.value),
  staleTime: 1000 * 30,
});

const { mutate } = useMutation({
  mutationFn: deleteProductAction,
  onSuccess: () => {
    queryClient.invalidateQueries({ queryKey: ["products", { page }] });
    toast.success("Product deleted successfully");
  },
  onError: () => {
    toast.error("Failed to delete product");
  },
});

const filteredProducts = computed(() => {
  if (!products.value || !size.value) { return products.value; }

  if (size.value !== "all") {
    return products.value.filter((product) => product.sizes.includes(size.value as Size));
  }

  return products.value.filter((product) =>
    product.title.toLowerCase().includes(search.value.toLowerCase()),
  );
});

watchEffect(() => {
  queryClient.prefetchQuery({
    queryKey: ["products", { page: page.value + 1 }],
    queryFn: () => getProductsAction(page.value + 1),
    staleTime: 1000 * 30,
  });
});
</script>

<template>
  <div class="bg-white px-5 py-2 rounded">
    <div class="flex items-center gap-6">
      <h1 class="text-3xl">
        Products
      </h1>
      <InputText v-model="search" class="w-full" name="search" icon="search" placeholder="Search by title" clearable />
      <InputSelect v-model="size" :options="sizeOptions" class="w-60" name="size" placeholder="Select size" clearable />
    </div>
    <div class="py-8 w-full">
      <div class="shadow overflow-hidden rounded border-b border-gray-200">
        <table class="min-w-full bg-white">
          <thead class="bg-gray-800 text-white">
            <tr>
              <th class="w-10 text-left py-3 px-4 uppercase font-semibold text-sm">
                Images
              </th>
              <th class="flex-1 text-left py-3 px-4 uppercase font-semibold text-sm">
                Title
              </th>
              <th class="w-28 py-3 px-4 uppercase font-semibold text-sm">
                Price
              </th>
              <th class="w-60 text-left py-3 px-4 uppercase font-semibold text-sm">
                Sizes
              </th>
            </tr>
          </thead>
          <AdminProductsSkeleton v-if="isLoading || isFetching" />
          <tbody v-else class="text-gray-700">
            <tr
              v-for="product in filteredProducts"
              :key="product.id"
              class="even:bg-gray-100 odd:bg-white hover:bg-gray-200"
            >
              <td class="text-left py-3 px-4">
                <img :src="product.images[0]" :alt="product.title" class="size-10 object-cover">
              </td>
              <td class="text-left py-3 px-4">
                <RouterLink class="hover:text-blue-500 hover:underline underline-offset-4" :to="{ name: 'admin-product', params: { productId: product.id } }">
                  {{ product.title }}
                </RouterLink>
              </td>
              <td class="text-center py-3 px-4">
                <span class="font-semibold centered">
                  <Badge size="sm">
                    ${{ product.price }}
                  </Badge>
                </span>
              </td>
              <td class="text-left py-3 px-4 flex  items-center justify-between">
                <span class="text-sm text-gray-500">
                  {{ product.sizes.join(", ") }}
                </span>
                <Button v-tooltip="'Delete'" icon="trash" variant="transparent" icon-size="size-6" @click="mutate(product.id)" />
              </td>
            </tr>
          </tbody>
        </table>
        <div v-if="!filteredProducts?.length" class="h-80 w-full centered">
          <span class="text-2xl">No products found...</span>
        </div>
      </div>
    </div>
    <Pagination
      class="bg-white"
      :has-more-data="!!products && products.length < 10"
      :page
    />
  </div>
</template>
