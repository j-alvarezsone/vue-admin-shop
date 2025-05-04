import type { Product } from "@/features/products/types/product";
import { tesloApi } from "@/api/tesloApi";
import { loginAction } from "@/features/auth/actions";
import { createUpdateProductAction } from "@/features/products/actions";

describe("createUpdateProductAction", () => {
  beforeAll(async () => {
    const resp = await loginAction("test1@google.com", "Abc123");

    if (!resp.ok) {
      throw new Error("Login failed");
    }

    localStorage.setItem("token", resp.token);
  });

  it("should create a new product", async () => {
    const product: Product = {
      id: "",
      title: "New Test product",
      slug: "new_test_product",
      description: "Test description",
      price: 100,
      stock: 10,
      images: [],
      sizes: [],
      tags: [],
      gender: "kid",
      user: {} as any,
    };

    const resp = await createUpdateProductAction(product);
    await tesloApi.delete(`/products/${resp.id}`);

    expect(resp).toEqual({
      title: "New Test product",
      price: 100,
      description: "Test description",
      slug: "new_test_product",
      stock: 10,
      sizes: [],
      gender: "kid",
      tags: [],
      images: [],
      user: {
        id: expect.any(String),
        email: expect.any(String),
        fullName: expect.any(String),
        isActive: expect.any(Boolean),
        roles: expect.any(Array),
      },
      id: expect.any(String),
    });
  });

  it("should update a product", async () => {
    const products = await tesloApi.get<Product[]>("/products");
    const product = products.data[0];
    const productId = product.id;

    const updatedProduct = {
      ...product,
      title: "Updated Test product",
      description: "Updated description",
      stock: 10,
    };
    const resp = await createUpdateProductAction(updatedProduct);

    expect(resp).toEqual(
      expect.objectContaining({
        ...product,
        id: productId,
        title: "Updated Test product",
        description: "Updated description",
        stock: 10,
      }),
    );
  });
});
