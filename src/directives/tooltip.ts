import type { Directive, DirectiveBinding } from "vue";
import { TOOLTIP, TOOLTIP_PLACEMENTS } from "@/features/shared/constants/tooltip";

const tooltipContainer = document.createElement("div");
let hideTimeout: number | null = null;
let wheelEventHandler: (() => void) | null = null;
let arrow: HTMLElement | null = null;

export const tooltip: Directive = {
  beforeMount(el: HTMLElement, binding: DirectiveBinding) {
    const mouseEnterHandler = () => handleMouseEnter(el, tooltipContainer, binding);
    const mouseLeaveHandler = () => handleMouseLeave(el, tooltipContainer, binding);

    el.onmouseenter = mouseEnterHandler;
    el.onmouseleave = mouseLeaveHandler;
  },
  updated(el: HTMLElement, binding: DirectiveBinding) {
    const mouseEnterHandler = () => handleMouseEnter(el, tooltipContainer, binding);
    const mouseLeaveHandler = () => handleMouseLeave(el, tooltipContainer, binding);

    el.onmouseenter = mouseEnterHandler;
    el.onmouseleave = mouseLeaveHandler;
  },
  beforeUnmount(el: HTMLElement) {
    el.onmouseenter = null;
    el.onmouseleave = null;
    tooltipContainer.onmouseenter = null;
    tooltipContainer.onmouseleave = null;

    if (document.body.contains(tooltipContainer)) {
      document.body.removeChild(tooltipContainer);
    }

    removeArrow();
  },
};

function updateTooltip(el: HTMLElement, { value, modifiers }: DirectiveBinding, container: HTMLDivElement) {
  if (typeof value === "string" || typeof value === "number") {
    const stringValue = typeof value === "number" ? value.toString() : value;

    if (modifiers.html) {
      container.innerHTML = stringValue;
      container.style.setProperty(TOOLTIP.PADDING, "0.75rem");
    } else {
      container.textContent = stringValue;
    }
  } else if (typeof value === "object") {
    applyObjectTooltipStyles(value, container);
  }

  container.className = "";
  container.classList.add("tooltip");

  setPlacement(el, container, modifiers, value);

  if (modifiers.bgLight || value?.bgLight) {
    container.style.setProperty(TOOLTIP.BACKGROUND_COLOR, "white");
    container.style.setProperty(TOOLTIP.TEXT_COLOR, "#374151");
  }

  if (modifiers.noArrow || value?.noArrow) {
    removeArrow();
  }
}

function applyObjectTooltipStyles(value: any, container: HTMLDivElement) {
  if (value?.html) {
    container.innerHTML = value.content;
    container.style.setProperty(TOOLTIP.PADDING, "0.75rem");
  } else {
    container.textContent = value.content;
  }

  if (value?.maxWidth) {
    container.style.setProperty(TOOLTIP.MAX_WIDTH, value.maxWidth);
  }

  if (value?.maxHeight) {
    container.style.setProperty(TOOLTIP.MAX_HEIGHT, value.maxHeight);
  }

  if (value?.fontSize) {
    container.style.setProperty(TOOLTIP.FONT_SIZE, value.fontSize);
  }

  if (value?.padding) {
    container.style.setProperty(TOOLTIP.PADDING, value.padding);
  }

  if (value?.zIndex) {
    container.style.setProperty(TOOLTIP.Z_INDEX, value.zIndex);
    arrow?.style.setProperty(TOOLTIP.Z_INDEX, value.zIndex);
  }
}

function setPlacement(
  el: HTMLElement,
  container: HTMLDivElement,
  modifiers: DirectiveBinding["modifiers"],
  value: DirectiveBinding["value"],
) {
  switch (value?.placement || true) {
    case modifiers.left:
    case TOOLTIP_PLACEMENTS.LEFT:
      alignLeft(el, container, modifiers, value);
      isOutOfBounds(container, (isOut) => {
        if (isOut) {
          alignRight(el, container, modifiers, value);
        }
      });
      break;
    case modifiers.leftStart:
    case TOOLTIP_PLACEMENTS.LEFT_START:
      alignLeftStart(el, container, modifiers, value);
      isOutOfBounds(container, (isOut) => {
        if (isOut) {
          alignRightStart(el, container, modifiers, value);
        }
      });
      break;
    case modifiers.leftEnd:
    case TOOLTIP_PLACEMENTS.LEFT_END:
      alignLeftEnd(el, container, modifiers, value);
      isOutOfBounds(container, (isOut) => {
        if (isOut) {
          alignRightEnd(el, container, modifiers, value);
        }
      });
      break;
    case modifiers.right:
    case TOOLTIP_PLACEMENTS.RIGHT:
      alignRight(el, container, modifiers, value);
      isOutOfBounds(container, (isOut) => {
        if (isOut) {
          alignLeft(el, container, modifiers, value);
        }
      });
      break;
    case modifiers.rightStart:
    case TOOLTIP_PLACEMENTS.RIGHT_START:
      alignRightStart(el, container, modifiers, value);
      isOutOfBounds(container, (isOut) => {
        if (isOut) {
          alignLeftStart(el, container, modifiers, value);
        }
      });
      break;
    case modifiers.rightEnd:
    case TOOLTIP_PLACEMENTS.RIGHT_END:
      alignRightEnd(el, container, modifiers, value);
      isOutOfBounds(container, (isOut) => {
        if (isOut) {
          alignLeftEnd(el, container, modifiers, value);
        }
      });
      break;
    case modifiers.bottom:
    case TOOLTIP_PLACEMENTS.BOTTOM:
      alignBottom(el, container, modifiers, value);
      isOutOfBounds(container, (isOut) => {
        if (isOut) {
          alignTop(el, container, modifiers, value);
        }
      });
      break;
    case modifiers.bottomStart:
    case TOOLTIP_PLACEMENTS.BOTTOM_START:
      alignBottomStart(el, container, modifiers, value);
      isOutOfBounds(container, (isOut) => {
        if (isOut) {
          alignTopStart(el, container, modifiers, value);
        }
      });
      break;
    case modifiers.bottomEnd:
    case TOOLTIP_PLACEMENTS.BOTTOM_END:
      alignBottomEnd(el, container, modifiers, value);
      isOutOfBounds(container, (isOut) => {
        if (isOut) {
          alignTopEnd(el, container, modifiers, value);
        }
      });
      break;
    case modifiers.topStart:
    case TOOLTIP_PLACEMENTS.TOP_START:
      alignTopStart(el, container, modifiers, value);
      isOutOfBounds(container, (isOut) => {
        if (isOut) {
          alignBottomStart(el, container, modifiers, value);
        }
      });
      break;
    case modifiers.topEnd:
    case TOOLTIP_PLACEMENTS.TOP_END:
      alignTopEnd(el, container, modifiers, value);
      isOutOfBounds(container, (isOut) => {
        if (isOut) {
          alignBottomEnd(el, container, modifiers, value);
        }
      });
      break;
    case TOOLTIP_PLACEMENTS.TOP:
      alignTop(el, container, modifiers, value);
      isOutOfBounds(container, (isOut) => {
        if (isOut) {
          alignBottom(el, container, modifiers, value);
        }
      });
      break;
    default:
      alignTop(el, container, modifiers, value);
      isOutOfBounds(container, (isOut) => {
        if (isOut) {
          alignBottom(el, container, modifiers, value);
        }
      });
  }
}

function removeTooltip(container: HTMLDivElement, binding: DirectiveBinding) {
  if (typeof binding.value === "string" || typeof binding.value === "object" || typeof binding.value === "number") {
    clearTooltip(binding, container);
  }
}

function removeArrow() {
  if (arrow && document.body.contains(arrow)) {
    document.body.removeChild(arrow);
    arrow.className = "";
    arrow.style.cssText = "";
    arrow = null;
  }
}

function handleMouseEnter(el: HTMLElement, container: HTMLDivElement, binding: DirectiveBinding) {
  const isValueMissing = !binding.value;
  const isContentMissing = typeof binding.value === "object" && !binding.value.content;

  if (isValueMissing || isContentMissing || binding.value?.disabled) {
    clearTooltip(binding, container);
    return;
  }

  if (hideTimeout) {
    clearTimeout(hideTimeout);
    hideTimeout = null;
  }

  if (arrow) {
    removeArrow();
  }

  container.style.setProperty(TOOLTIP.DISPLAY, "block");
  document.body.appendChild(container);

  arrow = document.createElement("div");
  arrow.className = "tooltip-arrow";
  arrow?.style.setProperty(TOOLTIP.ARROW_DISPLAY, "block");
  document.body.appendChild(arrow);

  updateTooltip(el, binding, container);

  wheelEventHandler = () => handleMouseLeave(el, container, binding);
  window.addEventListener("wheel", wheelEventHandler);

  container.onmouseenter = () => {
    if (hideTimeout) {
      clearTimeout(hideTimeout);
      hideTimeout = null;
    }
  };
}

function handleMouseLeave(el: HTMLElement, container: HTMLDivElement, binding: DirectiveBinding) {
  if (binding.modifiers.autoHide || binding.value?.autoHide) {
    removeTooltip(container, binding);
  } else {
    hideTimeout = window.setTimeout(() => {
      removeTooltip(container, binding);
    }, 50);
  }

  if (wheelEventHandler) {
    window.removeEventListener("wheel", wheelEventHandler);
    wheelEventHandler = null;
  }

  container.onmouseleave = () => handleMouseLeave(el, container, binding);
}

function clearTooltip({ modifiers, value, arg }: DirectiveBinding, container: HTMLDivElement) {
  container.className = "";
  container.style.cssText = "";

  if (arrow) {
    removeArrow();
  }

  if (modifiers.html || value?.html) {
    container.innerHTML = "";
  } else {
    container.textContent = "";
  }

  if (arg) {
    arg = undefined;
  }
}

function getElRect(el: HTMLElement) {
  return el.getBoundingClientRect();
}

function setPosition(container: HTMLElement, left: number, top: number) {
  container.style.left = `${left}px`;
  container.style.top = `${top}px`;
}

function setArrowTopPosition(
  el: HTMLElement,
  arrow: HTMLElement,
  modifiers: DirectiveBinding["modifiers"],
  value: DirectiveBinding["value"],
) {
  const elRect = getElRect(el);

  arrow.style.setProperty(TOOLTIP.ARROW_BORDER_COLOR, "#1e293b transparent transparent transparent");

  if (modifiers.bgLight || value?.bgLight) {
    arrow.style.setProperty(TOOLTIP.ARROW_BORDER_COLOR, "white transparent transparent transparent");
  }

  let arrowLeft = elRect.left + elRect.width / 2 - arrow.offsetWidth / 2;
  const arrowTop = elRect.top - arrow.offsetHeight;

  if (modifiers.topStart || value?.placement === TOOLTIP_PLACEMENTS.TOP_START) {
    arrowLeft = elRect.left + arrow.offsetWidth;
  }

  if (modifiers.topEnd || value?.placement === TOOLTIP_PLACEMENTS.TOP_END) {
    arrowLeft = elRect.right - arrow.offsetWidth * 2;
  }

  setPosition(arrow, arrowLeft, arrowTop);
}

function setArrowBottomPosition(
  el: HTMLElement,
  arrow: HTMLElement,
  modifiers: DirectiveBinding["modifiers"],
  value: DirectiveBinding["value"],
) {
  const elRect = getElRect(el);

  arrow.style.setProperty(TOOLTIP.ARROW_BORDER_COLOR, "transparent transparent #1e293b transparent");

  if (modifiers.bgLight || value?.bgLight) {
    arrow.style.setProperty(TOOLTIP.ARROW_BORDER_COLOR, "transparent transparent white transparent");
  }

  let arrowLeft = elRect.left + elRect.width / 2 - arrow.offsetWidth / 2;
  const arrowTop = elRect.bottom;

  if (modifiers.bottomStart || value?.placement === TOOLTIP_PLACEMENTS.BOTTOM_START) {
    arrowLeft = elRect.left + arrow.offsetWidth;
  }

  if (modifiers.bottomEnd || value?.placement === TOOLTIP_PLACEMENTS.BOTTOM_END) {
    arrowLeft = elRect.right - arrow.offsetWidth * 2;
  }

  setPosition(arrow, arrowLeft, arrowTop);
}

function setArrowLeftPosition(
  el: HTMLElement,
  arrow: HTMLElement,
  modifiers: DirectiveBinding["modifiers"],
  value: DirectiveBinding["value"],
) {
  const elRect = getElRect(el);

  arrow.style.setProperty(TOOLTIP.ARROW_BORDER_COLOR, "transparent transparent transparent #1e293b");

  if (modifiers.bgLight || value?.bgLight) {
    arrow.style.setProperty(TOOLTIP.ARROW_BORDER_COLOR, "transparent transparent transparent white");
  }

  const arrowLeft = elRect.left - arrow.offsetWidth;

  let arrowTop = elRect.top + elRect.height / 2 - arrow.offsetHeight / 2;

  if (modifiers.leftStart || value?.placement === TOOLTIP_PLACEMENTS.LEFT_START) {
    arrowTop = elRect.top + arrow.offsetHeight;
  }

  if (modifiers.leftEnd || value?.placement === TOOLTIP_PLACEMENTS.LEFT_END) {
    arrowTop = elRect.bottom - arrow.offsetHeight * 2;
  }

  setPosition(arrow, arrowLeft, arrowTop);
}

function setArrowRightPosition(
  el: HTMLElement,
  arrow: HTMLElement,
  modifiers: DirectiveBinding["modifiers"],
  value: DirectiveBinding["value"],
) {
  const elRect = getElRect(el);

  arrow.style.setProperty(TOOLTIP.ARROW_BORDER_COLOR, "transparent #1e293b transparent transparent");

  if (modifiers.bgLight || value?.bgLight) {
    arrow.style.setProperty(TOOLTIP.ARROW_BORDER_COLOR, "transparent white transparent transparent");
  }

  let arrowTop = elRect.top + elRect.height / 2 - arrow.offsetHeight / 2;
  const arrowLeft = elRect.right;

  if (modifiers.rightStart || value?.placement === TOOLTIP_PLACEMENTS.RIGHT_START) {
    arrowTop = elRect.top + arrow.offsetHeight;
  }

  if (modifiers.rightEnd || value?.placement === TOOLTIP_PLACEMENTS.RIGHT_END) {
    arrowTop = elRect.bottom - arrow.offsetHeight * 2;
  }

  setPosition(arrow, arrowLeft, arrowTop);
}

function alignTop(
  el: HTMLElement,
  container: HTMLDivElement,
  modifiers: DirectiveBinding["modifiers"],
  value: DirectiveBinding["value"],
) {
  const elRect = getElRect(el);

  const left = elRect.left + (elRect.width - container.offsetWidth) / 2;
  const top = elRect.top - container.offsetHeight - 12;

  setPosition(container, left, top);

  if (arrow) {
    setArrowTopPosition(el, arrow, modifiers, value);
  }
}

function alignTopStart(
  el: HTMLElement,
  container: HTMLDivElement,
  modifiers: DirectiveBinding["modifiers"],
  value: DirectiveBinding["value"],
) {
  const elRect = getElRect(el);

  const left = elRect.left;
  const top = elRect.top - container.offsetHeight - 12;

  setPosition(container, left, top);

  if (arrow) {
    setArrowTopPosition(el, arrow, modifiers, value);
  }
}

function alignTopEnd(
  el: HTMLElement,
  container: HTMLDivElement,
  modifiers: DirectiveBinding["modifiers"],
  value: DirectiveBinding["value"],
) {
  const elRect = getElRect(el);

  const left = elRect.right - container.offsetWidth;
  const top = elRect.top - container.offsetHeight - 12;

  setPosition(container, left, top);

  if (arrow) {
    setArrowTopPosition(el, arrow, modifiers, value);
  }
}

function alignBottom(
  el: HTMLElement,
  container: HTMLDivElement,
  modifiers: DirectiveBinding["modifiers"],
  value: DirectiveBinding["value"],
) {
  const elRect = getElRect(el);

  const left = elRect.left + (elRect.width - container.offsetWidth) / 2;
  const top = elRect.bottom + 12;

  setPosition(container, left, top);

  if (arrow) {
    setArrowBottomPosition(el, arrow, modifiers, value);
  }
}

function alignBottomStart(
  el: HTMLElement,
  container: HTMLDivElement,
  modifiers: DirectiveBinding["modifiers"],
  value: DirectiveBinding["value"],
) {
  const elRect = getElRect(el);

  const left = elRect.left;
  const top = elRect.bottom + 12;

  setPosition(container, left, top);

  if (arrow) {
    setArrowBottomPosition(el, arrow, modifiers, value);
  }
}

function alignBottomEnd(
  el: HTMLElement,
  container: HTMLDivElement,
  modifiers: DirectiveBinding["modifiers"],
  value: DirectiveBinding["value"],
) {
  const elRect = getElRect(el);

  const left = elRect.right - container.offsetWidth;
  const top = elRect.bottom + 12;

  setPosition(container, left, top);

  if (arrow) {
    setArrowBottomPosition(el, arrow, modifiers, value);
  }
}

function alignLeft(
  el: HTMLElement,
  container: HTMLDivElement,
  modifiers: DirectiveBinding["modifiers"],
  value: DirectiveBinding["value"],
) {
  const elRect = getElRect(el);

  const left = elRect.left - container.offsetWidth - 12;
  const top = elRect.top + (elRect.height - container.offsetHeight) / 2;

  setPosition(container, left, top);

  if (arrow) {
    setArrowLeftPosition(el, arrow, modifiers, value);
  }
}

function alignLeftStart(
  el: HTMLElement,
  container: HTMLDivElement,
  modifiers: DirectiveBinding["modifiers"],
  value: DirectiveBinding["value"],
) {
  const elRect = getElRect(el);

  const left = elRect.left - container.offsetWidth - 12;
  const top = elRect.top;

  setPosition(container, left, top);

  if (arrow) {
    setArrowLeftPosition(el, arrow, modifiers, value);
  }
}

function alignLeftEnd(
  el: HTMLElement,
  container: HTMLDivElement,
  modifiers: DirectiveBinding["modifiers"],
  value: DirectiveBinding["value"],
) {
  const elRect = getElRect(el);

  const left = elRect.left - container.offsetWidth - 12;
  const top = elRect.bottom - container.offsetHeight;

  setPosition(container, left, top);

  if (arrow) {
    setArrowLeftPosition(el, arrow, modifiers, value);
  }
}

function alignRight(
  el: HTMLElement,
  container: HTMLDivElement,
  modifiers: DirectiveBinding["modifiers"],
  value: DirectiveBinding["value"],
) {
  const elRect = getElRect(el);

  const left = elRect.right + 12;
  const top = elRect.top + (elRect.height - container.offsetHeight) / 2;

  setPosition(container, left, top);

  if (arrow) {
    setArrowRightPosition(el, arrow, modifiers, value);
  }
}

function alignRightStart(
  el: HTMLElement,
  container: HTMLDivElement,
  modifiers: DirectiveBinding["modifiers"],
  value: DirectiveBinding["value"],
) {
  const elRect = getElRect(el);

  const left = elRect.right + 12;
  const top = elRect.top;

  setPosition(container, left, top);

  if (arrow) {
    setArrowRightPosition(el, arrow, modifiers, value);
  }
}

function alignRightEnd(
  el: HTMLElement,
  container: HTMLDivElement,
  modifiers: DirectiveBinding["modifiers"],
  value: DirectiveBinding["value"],
) {
  const elRect = getElRect(el);

  const left = elRect.right + 12;
  const top = elRect.bottom - container.offsetHeight;

  setPosition(container, left, top);

  if (arrow) {
    setArrowRightPosition(el, arrow, modifiers, value);
  }
}

function isOutOfBounds(container: HTMLDivElement, cb: (isOut: boolean) => void) {
  const containerRect = container.getBoundingClientRect();

  const width = container.offsetWidth;
  const height = container.offsetHeight;
  const viewportWidth = window.innerWidth || document.documentElement.clientWidth;
  const viewportHeight = window.innerHeight || document.documentElement.clientHeight;

  cb(
    containerRect.left + width > viewportWidth
    || containerRect.left < 0
    || containerRect.top < 0
    || containerRect.top + height > viewportHeight,
  );
}
