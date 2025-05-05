import type { Mock } from "vitest";
import { fakeProducts } from "@/__tests__/fake/products.fake";
import { tooltip } from "@/directives/tooltip";
import ProductsView from "@/features/admin/views/ProductsView.vue";
import { useQuery, useQueryClient } from "@tanstack/vue-query";
import { shallowMount } from "@vue/test-utils";
import { createPinia } from "pinia";
import { createRouter, createWebHistory } from "vue-router";

const router = createRouter({
  history: createWebHistory(),
  routes: [
    {
      path: "/",
      component: ProductsView,
    },
  ],
});

vi.mock("@tanstack/vue-query", () => {
  return {
    useQueryClient: vi.fn().mockReturnValue({
      prefetchQuery: vi.fn(),
    }),
    useQuery: vi.fn(),
    useMutation: vi.fn().mockReturnValue({ mutate: vi.fn() }),
  };
});

describe("<ProductsView />", () => {
  (useQuery as Mock).mockReturnValue({
    data: fakeProducts,
  });

  window.scrollTo = vi.fn();

  const wrapper = shallowMount(ProductsView, {
    global: {
      plugins: [router, createPinia()],
      directives: {
        tooltip,
      },
    },
  });

  it("should render with default values", () => {
    expect(wrapper.html()).toMatchSnapshot();
  });

  it("should prefetch query on mounted", async () => {
    await router.replace("/?page=2");

    expect(useQueryClient().prefetchQuery).toHaveBeenCalledWith({
      queryKey: ["products", { page: 3 }],
      queryFn: expect.any(Function),
      staleTime: 1000 * 30,
    });

    expect(window.scrollTo).toHaveBeenCalledWith({
      behavior: "smooth",
      top: 0,
    });
  });
});
