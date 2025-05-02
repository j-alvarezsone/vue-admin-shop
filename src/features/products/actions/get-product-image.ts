import { env } from "@/lib/utils/env";

export function getProductImageAction(imageName: string): string {
  return imageName.includes("http") ? imageName : `${env.VITE_TESLO_API_URL}/files/product/${imageName}`;
}
