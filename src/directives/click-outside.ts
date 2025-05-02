import type { DirectiveBinding } from "vue";

type ClickableElement = HTMLElement & {
  clickOutsideEvent?: (event: Event) => void
};

export const clickOutside = {
  mounted(el: ClickableElement, binding: DirectiveBinding) {
    if (typeof binding.value === "function") {
      el.clickOutsideEvent = (event) => {
        const targetElement = event.target as Element;
        if (!(el === targetElement || el.contains(targetElement))) {
          binding.value(event);
        }
      };
    } else {
      el.clickOutsideEvent = (event: Event) => {
        const targetElement = event.target as Element;
        const { handler, ignore } = binding.value;
        const ignoreElement = ignore?.some((i: any) => {
          return (
            targetElement.classList.contains(i) || targetElement.id === i || targetElement === i
          );
        });

        if (!ignoreElement && !(el === targetElement || el.contains(targetElement))) {
          handler(event);
        }
      };
    }
    document.addEventListener("click", el.clickOutsideEvent);
  },
  unmounted(el: ClickableElement) {
    if (el.clickOutsideEvent) {
      document.body.removeEventListener("click", el.clickOutsideEvent);
    }
  },
};
