import type { Product } from "../types/product";
import { tesloApi } from "@/api/tesloApi";
import { getProductImageAction } from "./get-product-image";

export async function getProductsAction(page: number = 1, limit: number = 10) {
  try {
    const { data } = await tesloApi.get<Product[]>(`/products?limit=${limit}&offset=${(page - 1) * limit}`);

    return data.map((product) => ({
      ...product,
      images: product.images.map(getProductImageAction),
    }));
  } catch (error) {
    console.log(error);
    throw new Error("Error fetching products");
  }
}
