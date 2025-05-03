import type { User } from "@/features/auth/types/user";
import type { ObjectValues } from "@/features/shared/types";
import type { SIZES } from "../constants/product";

export interface Product {
  id: string
  title: string
  price: number
  description: string
  slug: string
  stock: number
  sizes: Size[]
  gender: string
  tags: string[]
  images: string[]
  user: User
}

export type Size = ObjectValues<typeof SIZES>;
