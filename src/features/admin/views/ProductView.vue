<script setup lang="ts">
import type { Product } from "@/features/products/types/product";
import { createUpdateProductAction, getProductByIdAction } from "@/features/products/actions";
import Button from "@/features/shared/components/ui/Button.vue";
import InputSelect from "@/features/shared/components/ui/form/InputSelect.vue";
import InputText from "@/features/shared/components/ui/form/InputText.vue";
import InputTextArea from "@/features/shared/components/ui/form/InputTextArea.vue";
import { useMutation, useQuery } from "@tanstack/vue-query";
import { toTypedSchema } from "@vee-validate/zod";
import { useFieldArray, useFieldError, useForm } from "vee-validate";
import { watch, watchEffect } from "vue";
import { useRoute, useRouter } from "vue-router";
import { useToast } from "vue-toastification";
import { z } from "zod";

type Form = Omit<Product, "id" | "user">;

const allSizes = ["XS", "S", "M", "L", "XL", "XXL"];
const options = [
  { value: "men", label: "Men" },
  { value: "women", label: "Women" },
  { value: "kid", label: "Kid" },
];

const route = useRoute();
const router = useRouter();
const toast = useToast();

const { data: product, isError, isLoading, refetch } = useQuery({
  queryKey: ["product", route.params.productId],
  queryFn: () => getProductByIdAction(route.params.productId as string),
  retry: false,
});

const { isPending, isSuccess: isUpdateSuccess, data: updatedProduct, mutate } = useMutation({
  mutationFn: createUpdateProductAction,
});

const schema = z.object({
  title: z.string().nonempty("Product title is required"),
  slug: z.string().nonempty("Slug is required"),
  description: z.string().nonempty("Description is required"),
  price: z.number().min(1, "Price is required"),
  stock: z.number().min(1, "Stock is required"),
  sizes: z.string().array().min(1, "At least one size is required"),
  gender: z.string().nonempty("Gender is required"),
  images: z.array(z.string().url("Image must be a valid URL")),
});

const { values, meta, handleSubmit, resetForm } = useForm<Form>({
  initialValues: {
    title: "",
    slug: "",
    description: "",
    price: 0,
    stock: 0,
    sizes: [],
    gender: "",
    images: [],
  },
  validationSchema: toTypedSchema(schema),
});

const { fields: imagesFields } = useFieldArray<string>("images");
const { fields: sizesFields, remove: removeSize, push: pushSize } = useFieldArray<string>("sizes");
const sizesError = useFieldError("sizes");

watchEffect(() => {
  if (isError.value && !isLoading.value) {
    router.replace({ name: "admin-products" });
  }
});

watch(product, () => {
  if (!product.value) { return; }

  const { user, ...rest } = product.value;

  resetForm({
    values: rest,
  });
}, { deep: true, immediate: true });

watch(isUpdateSuccess, (value) => {
  if (!value) { return; }

  toast.success("Product updated successfully");
  router.replace(`/admin/products/${updatedProduct.value!.id}`);

  resetForm({
    values: updatedProduct.value,
  });
});

watch(() => route.params.productId, () => {
  refetch();
});

function toggleSize(size: string) {
  const currentSizes = sizesFields.value.map((field) => field.value);

  if (hasSize(size)) {
    removeSize(currentSizes.indexOf(size));
  } else {
    pushSize(size);
  }
}

function hasSize(size: string) {
  return sizesFields.value.some((field) => field.value === size);
}

const onSubmit = handleSubmit((values) => {
  if (route.params.productId === "create") {
    mutate(values);
    return;
  }
  mutate({ id: route.params.productId as string, ...values });
});
</script>

<template>
  <div class="bg-white px-5 py-2 rounded">
    <h1 class="text-3xl">
      Product: <small class="text-blue-500">{{ values.title }}</small>
    </h1>
    <hr class="my-4">

    <form class="grid grid-cols-1 sm:grid-cols-2 gap-5" @submit.prevent="onSubmit">
      <div class="flex flex-col gap-4">
        <InputText name="title" label="title" placeholder="Enter product name" />
        <InputText name="slug" label="slug" placeholder="Unique url identifier" />
        <InputTextArea name="description" label="description" placeholder="Enter product description" />
        <div class="flex flex-ro gap-3">
          <InputText class="w-full" name="price" label="price" type="number" />
          <InputText class="w-full" name="stock" label="inventory" type="number" />
        </div>

        <div>
          <label for="sizes" class="form-label">Sizes</label>
          <div class="flex gap-4">
            <Button v-for="size in allSizes" :key="size" class="flex-1" :class="{ 'bg-gray-400': !hasSize(size) }" variant="tertiary" @click="toggleSize(size)">
              {{ size }}
            </Button>
          </div>
          <div class="mt-2">
            <span v-if="sizesError" class="text-red-500">{{ sizesError }}</span>
          </div>
        </div>
      </div>
      <div>
        <label for="stock" class="form-label">Images</label>
        <div class="flex p-2 overflow-x-auto space-x-8 w-full h-[265px] bg-gray-200 rounded">
          <div v-for="image in imagesFields" :key="image.key" class="flex-shrink-0">
            <img :src="image.value" :alt="values.title" class="w-[250px] h-[250px]">
          </div>
        </div>
        <div class="col-span-2 my-2">
          <label for="image" class="form-label">Upload image</label>

          <input id="image" multiple type="file" class="form-control">
        </div>
        <InputSelect class="mt-4" name="gender" :options label="gender" placeholder="Select gender" clearable />
        <div class="my-4 text-right">
          <Button
            type="submit"
            :disabled="!meta.valid"
            :loading="isPending"
          >
            Save
          </Button>
        </div>
      </div>
    </form>
  </div>
</template>
