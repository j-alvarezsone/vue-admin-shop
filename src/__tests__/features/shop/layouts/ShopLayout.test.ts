import ShopLayout from "@/features/shop/layouts/ShopLayout.vue";
import { shallowMount } from "@vue/test-utils";

describe("<ShopLayout />", () => {
  it("should render menu, router view and footer", () => {
    const wrapper = shallowMount(ShopLayout, {
      global: { stubs: ["RouterView"] },
    });

    expect(wrapper.findComponent({ name: "Menubar" }).exists()).toBe(true);
    expect(wrapper.findComponent({ name: "RouterView" }).exists()).toBe(true);
    expect(wrapper.findComponent({ name: "Footer" }).exists()).toBe(true);
  });
});
