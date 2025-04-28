import type { Product } from "../types/product";
import { tesloApi } from "@/api/tesloApi";
import { getProductImage } from "./get-product-image";

export async function getProducts(page: number = 1, limit: number = 10) {
  try {
    const { data } = await tesloApi.get<Product[]>(`/products?limit=${limit}&offset=${page * limit}`);

    return data.map((product) => ({
      ...product,
      images: product.images.map(getProductImage),
    }));
  } catch (error) {
    console.log(error);
    throw new Error("Error fetching products");
  }
}
