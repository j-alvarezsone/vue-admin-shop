import type { Directive, DirectiveBinding } from "vue";

const RIPPLE_ANIM_DURATION = 600;

export const ripple: Directive = {
  beforeMount(el: HTMLElement & { rippleShow?: (e: MouseEvent | TouchEvent) => void }, { value }: DirectiveBinding) {
    const rippleShow = (e: MouseEvent | TouchEvent) => {
      if (typeof value === "object" && value.disabled)
        return;

      const rect = el.getBoundingClientRect();

      const posX = (e as MouseEvent).clientX - rect.left;
      const posY = (e as MouseEvent).clientY - rect.top;
      const backgroundColor = typeof value === "object" && value.background ? value.background : "";

      let buttonWidth = el.offsetWidth;
      let buttonHeight = el.offsetHeight;

      if (buttonWidth > buttonHeight) {
        buttonHeight = buttonWidth;
      } else {
        buttonWidth = buttonHeight;
      }

      const spanEl = document.createElement("span");
      spanEl.className = "ripple";
      spanEl.style.width = `${buttonWidth}px`;
      spanEl.style.height = `${buttonHeight}px`;
      spanEl.style.top = `${posY - buttonHeight / 2}px`;
      spanEl.style.left = `${posX - buttonWidth / 2}px`;
      spanEl.style.position = "absolute";
      spanEl.style.borderRadius = "50%";
      spanEl.style.background = backgroundColor || "rgba(255, 255, 255, 0.4)";
      spanEl.style.transform = "scale(0)";
      spanEl.style.opacity = "1";
      spanEl.style.animation = `ripple-drop ${RIPPLE_ANIM_DURATION / 1000}s linear`;
      spanEl.style.animationFillMode = "forwards";

      const rippleDropKeyframes = `
        @keyframes ripple-drop {
          100% {
            transform: scale(2);
            opacity: 0;
          }
        }
      `;

      const styleEl = document.createElement("style");
      document.head.appendChild(styleEl);
      styleEl.sheet?.insertRule(rippleDropKeyframes, 0);

      el.appendChild(spanEl);

      setTimeout(() => {
        spanEl.remove();
        styleEl.remove();
      }, RIPPLE_ANIM_DURATION);
    };

    el.rippleShow = rippleShow;

    if ("ontouchstart" in document.documentElement) {
      el.addEventListener("touchstart", rippleShow, { passive: true });
    } else {
      el.addEventListener("mousedown", rippleShow);
    }
  },
  beforeUnmount(el: HTMLElement & { rippleShow?: (e: MouseEvent | TouchEvent) => void }) {
    if (el.rippleShow) {
      el.removeEventListener("touchstart", el.rippleShow);
      el.removeEventListener("mousedown", el.rippleShow);
    }
  },
};
