import type { Mock } from "vitest";
import { fakeProducts } from "@/__tests__/fake/products.fake";
import ProductView from "@/features/admin/views/ProductView.vue";
import { useMutation, useQuery } from "@tanstack/vue-query";
import { shallowMount } from "@vue/test-utils";
import { createPinia } from "pinia";
import { ref } from "vue";
import { createRouter, createWebHistory, useRouter } from "vue-router";

vi.mock("vue-router", async (original) => {
  const originalImpl = await original();

  return {
    ...(originalImpl as any),
    useRouter: vi.fn(),
  };
});

vi.mock("@tanstack/vue-query");

const router = createRouter({
  history: createWebHistory(),
  routes: [
    {
      path: "/",
      component: ProductView,
    },
  ],
});

describe("<ProductView />", () => {
  const fakeProduct = fakeProducts.at(0);
  const mutateSpy = vi.fn();
  const replaceSpy = vi.fn();

  (useMutation as Mock).mockReturnValue({
    mutate: mutateSpy,
    isPending: ref(false),
    isSuccess: ref(false),
    data: ref(fakeProduct),
  });

  (useQuery as Mock).mockReturnValue({
    data: ref({}),
    isError: ref(true),
    isLoading: ref(false),
    refetch: vi.fn(),
  });

  (useRouter as Mock).mockReturnValue({
    replace: replaceSpy,
  });

  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("should redirect to products if id not found", () => {
    shallowMount(ProductView, {
      global: {
        plugins: [createPinia(), router],
      },
    });

    expect(replaceSpy).toHaveBeenCalledWith(
      { name: "admin-products" },
    );
  });

  it("should render page with a product", () => {
    (useQuery as Mock).mockReturnValue({
      data: ref(fakeProduct),
      isError: ref(false),
      isLoading: ref(false),
      refetch: vi.fn(),
    });

    const wrapper = shallowMount(ProductView, {
      global: {
        plugins: [createPinia(), router],
      },
    });

    const inputTexts = wrapper.findAllComponents({ name: "InputText" });
    const inputTextarea = wrapper.findComponent({ name: "InputTextarea" });
    const inputNames = ["title", "slug", "price", "stock"];
    const Buttons = wrapper.findAllComponents({ name: "Button" });
    const sizeButton = Buttons.find((button) => button.props("variant") === "tertiary");
    expect(inputTexts.length).toBe(4);
    inputTexts.forEach((input) => {
      const inputName = input.props("name");
      expect(inputNames).toContain(inputName);
    });

    expect(inputTextarea.exists()).toBe(true);
    expect(inputTextarea.props("name")).toBe("description");

    if (fakeProduct?.sizes.includes(sizeButton!.text())) {
      expect(sizeButton?.classes()).toContain("bg-blue-600");
    } else {
      expect(sizeButton?.classes()).not.toContain("bg-gray-400");
    }
  });
});
