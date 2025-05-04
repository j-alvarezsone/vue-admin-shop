import { env } from "@/lib/utils/env";
import { getProductImageAction } from "../../../../features/products/actions/get-product-image";

describe("getProductImageAction", () => {
  it("should return proper image URL", () => {
    const imageName = "test.jpg";

    const url = getProductImageAction(imageName);
    const expectedUrl = `${env.VITE_TESLO_API_URL}/files/product/${imageName}`;

    expect(url).toBe(expectedUrl);
  });

  it("should return the same URL if it already contains http", () => {
    const imageName = "http://example.com/test.jpg";

    const url = getProductImageAction(imageName);

    expect(url).toBe(imageName);
  });
});
