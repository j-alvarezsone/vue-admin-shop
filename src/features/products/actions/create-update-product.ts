import type { Product } from "../types/product";
import { tesloApi } from "@/api/tesloApi";

export async function createUpdateProductAction(product: Partial<Product>) {
  const productId = product.id;
  const newImages = await uploadImages(product.images ?? []);

  product.images = newImages;
  product = cleanProductForCreateUpdate(product);

  if (productId && productId !== "") {
    return await updateProduct(productId, product);
  }

  return await createProduct(product);
}

function cleanProductForCreateUpdate(product: Partial<Product>) {
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

  return product;
}

async function updateProduct(productId: string, product: Partial<Product>) {
  try {
    const { data } = await tesloApi.patch<Product>(`/products/${productId}`, product);

    return data;
  } catch (error) {
    console.log("Error updating product", error);
    throw new Error("Error updating product");
  }
}

async function createProduct(product: Partial<Product>) {
  try {
    const { data } = await tesloApi.post<Product>("/products", product);

    return data;
  } catch (error) {
    console.log("Error creating product", error);
    throw new Error("Error creating product");
  }
}

async function uploadImages(images: (string | File)[]) {
  const filesToUpload = images.filter((image) => image instanceof File) as File[];
  const currentImages = images.filter((image) => typeof image === "string") as string[];

  const uploadPromises = filesToUpload.map(async (file) => {
    try {
      const formData = new FormData();
      formData.append("file", file);

      const { data } = await tesloApi.post<{ secureUrl: string }>("files/product", formData);

      return data.secureUrl;
    } catch (error) {
      console.log("Error uploading image", error);
      throw new Error("Error uploading image");
    }
  });

  const uploadedImages = await Promise.all(uploadPromises);

  return [...currentImages, ...uploadedImages];
}
