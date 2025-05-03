import { tesloApi } from "@/api/tesloApi";

export async function deleteProductAction(productId: string): Promise<void> {
  try {
    const res = await tesloApi.delete(`/products/${productId}`);

    if (res.status !== 200) {
      const message = res.data?.message || "Error deleting product";
      throw new Error(message);
    }
  } catch (error) {
    if (error instanceof Error) {
      console.log(error.message);
    } else {
      console.log(error);
    }
    throw new Error("Error deleting product");
  }
}
