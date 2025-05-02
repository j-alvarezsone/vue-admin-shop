import type { Directive, DirectiveBinding } from "vue";

export const focus: Directive = {
  mounted: (el: HTMLElement, binding: DirectiveBinding): void => {
    const { value } = binding;

    if (value) {
      el.focus();
    }
  },
};
