<script setup lang="ts">
import Button from "@/features/shared/components/Button.vue";

const allSizes = ["XS", "S", "M", "L", "XL", "XXL"];
</script>

<template>
  <div class="bg-white px-5 py-2 rounded">
    <h1 class="text-3xl">
      Product: <small class="text-blue-500">name</small>
    </h1>
    <hr class="my-4">

    <form class="grid grid-cols-1 sm:grid-cols-2 gap-5">
      <div class="flex flex-col gap-4">
        <div>
          <label for="title" class="form-label">title</label>
          <input id="title" type="text" class="form-control">
        </div>

        <div>
          <label for="slug" class="form-label">Slug</label>
          <input id="slug" type="text" class="form-control">
        </div>

        <div>
          <label for="description" class="form-label">Description</label>
          <textarea
            id="description"
            class="shadow h-32 appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
          />
        </div>

        <div class="flex flex-ro gap-3">
          <div>
            <label for="price" class="form-label">Price</label>
            <input id="price" type="number" class="form-control">
          </div>

          <div>
            <label for="stock" class="form-label">Inventory</label>
            <input id="stock" type="number" class="form-control">
          </div>
        </div>

        <div>
          <label for="sizes" class="form-label">Sizes</label>
          <div class="flex gap-4">
            <Button v-for="size in allSizes" :key="size" class="flex-1" variant="tertiary">
              {{ size }}
            </Button>
          </div>
        </div>
      </div>
      <div>
        <label for="stock" class="form-label">Images</label>
        <div class="flex p-2 overflow-x-auto space-x-8 w-full h-[265px] bg-gray-200 rounded">
          <div class="flex-shrink-0">
            <img src="https://placehold.co/250x250" alt="imagen" class="w-[250px] h-[250px]">
          </div>

          <div class="flex-shrink-0">
            <img src="https://placehold.co/250x250" alt="imagen" class="w-[250px] h-[250px]">
          </div>
        </div>
        <div class="col-span-2 my-2">
          <label for="image" class="form-label">Upload image</label>

          <input id="image" multiple type="file" class="form-control">
        </div>
        <div class="mb-4">
          <label for="stock" class="form-label">Gender</label>
          <select class="form-control">
            <option value="">
              Select
            </option>
            <option value="kid">
              Child
            </option>
            <option value="women">
              Woman
            </option>
            <option value="men">
              Man
            </option>
          </select>
        </div>
        <div class="my-4 text-right">
          <Button
            type="submit"
          >
            Save
          </Button>
        </div>
      </div>
    </form>
  </div>
</template>
