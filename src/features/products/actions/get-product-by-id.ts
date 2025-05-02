import type { Product } from "../types/product";
import { tesloApi } from "@/api/tesloApi";
import { getProductImageAction } from "./get-product-image";

export async function getProductByIdAction(productId: string): Promise<Product> {
  if (productId === "create") {
    return {
      id: "",
      title: "",
      slug: "",
      description: "",
      price: 0,
      stock: 0,
      images: [],
      sizes: [],
      tags: [],
      gender: "",
      user: {} as any,
    };
  }
  try {
    const { data } = await tesloApi.get<Product>(`/products/${productId}`);
    return {
      ...data,
      images: data.images.map(getProductImageAction),
    };
  } catch (error) {
    console.error("Error fetching product by ID:", error);
    throw new Error(`Failed to fetch product with ID: ${productId}`);
  }
}
