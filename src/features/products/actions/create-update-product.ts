import type { Product } from "../types/product";
import { tesloApi } from "@/api/tesloApi";

export async function createUpdateProductAction(product: Partial<Product>) {
  if (product.id && product.id !== "") {
    return await updateProduct(product);
  }

  return await createProduct(product);
}

async function updateProduct(product: Partial<Product>) {
  const images: string[] = product.images?.map((image) => {
    if (image.startsWith("http")) {
      const imageName = image.split("/").pop();

      return imageName ? image : "";
    }
    return image;
  }) ?? [];

  const productId = product.id;
  delete product.id;
  delete product.user;
  product.images = images;

  try {
    const { data } = await tesloApi.patch<Product>(`/products/${productId}`, product);

    return data;
  } catch (error) {
    console.log("Error updating product", error);
    throw new Error("Error updating product");
  }
}

async function createProduct(product: Partial<Product>) {
  const images: string[] = product.images?.map((image) => {
    if (image.startsWith("http")) {
      const imageName = image.split("/").pop();

      return imageName ? image : "";
    }
    return image;
  }) ?? [];

  delete product.id;
  delete product.user;
  product.images = images;

  try {
    const { data } = await tesloApi.post<Product>("/products", product);

    return data;
  } catch (error) {
    console.log("Error creating product", error);
    throw new Error("Error creating product");
  }
}
