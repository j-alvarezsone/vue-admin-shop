import type { Product } from "@/features/products/types/product";
import { fakeProducts } from "@/__tests__/fake/products.fake";
import { tesloApi } from "@/api/tesloApi";
import { getProductByIdAction, getProductsAction } from "@/features/products/actions";
import MockAdapter from "axios-mock-adapter";

const mock = new MockAdapter(tesloApi);

beforeEach(() => {
  mock.reset();
  mock.onGet(/\/?products\/[a-z0-9-]+/i).reply((config) => {
    const id = config.url?.split("/").pop();
    const product = fakeProducts.find((p) => p.id === id);

    if (!product) {
      return [404];
    }

    return [200, product];
  });
  mock.onGet(/\/?products.*/).reply(200, fakeProducts);

  vi.spyOn(console, "error").mockImplementation(() => {});
});

describe("getProductByIdAction", () => {
  let products: Product[];

  beforeEach(async () => {
    products = await getProductsAction();
  });

  it("should return empty product on create argument", async () => {
    const product = await getProductByIdAction("create");
    expect(product).toEqual(
      {
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
        user: {},
      },
    );
  });

  it("should return a product if ID is found", async () => {
    const product = await getProductByIdAction(products[0].id);

    product.images.sort((a, b) => a.localeCompare(b));
    products[0].images.sort((a, b) => a.localeCompare(b));

    expect(product).toEqual(products.at(0));
  });

  it("should return empty product if ID is not found", async () => {
    try {
      await getProductByIdAction("non-existing-id");
      expect(true).toBe(false);
    } catch (error) {
      if (error instanceof Error) {
        expect(error.message).toBe("Failed to fetch product with ID: non-existing-id");
      }
    }
  });
});
