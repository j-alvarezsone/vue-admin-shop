import type { Product } from "@/features/products/types/product";
import { fakeProducts } from "@/__tests__/fake/products.fake";
import { tesloApi } from "@/api/tesloApi";
import { getProductsAction } from "@/features/products/actions";
import { env } from "@/lib/utils/env";
import MockAdapter from "axios-mock-adapter";

const mock = new MockAdapter(tesloApi);

beforeEach(() => {
  mock.reset();
  mock.onGet(/\/products.*/).reply(200, fakeProducts);
});

describe("getProductsAction", () => {
  let products: Product[];

  beforeEach(async () => {
    products = await getProductsAction(1, 10);
  });

  it("should return a list of products with the expected structure", () => {
    expect(products.length).toBe(10);
    expect(products.at(0)).toEqual(
      expect.objectContaining({
        id: expect.any(String),
        title: expect.any(String),
        price: expect.any(Number),
        description: expect.any(String),
        stock: expect.any(Number),
        sizes: expect.any(Array),
        gender: expect.any(String),
        tags: expect.any(Array),
        images: expect.any(Array),
        user: expect.anything(),
      }),
    );
  });

  it("products should have a full image url", () => {
    products.forEach((product) => {
      product.images.forEach((image) => {
        expect(image).toMatch(/^(http|https):\/\/.+/);
        expect(image).toContain(`${env.VITE_TESLO_API_URL}/files/product`);
      });
    });
  });
});
