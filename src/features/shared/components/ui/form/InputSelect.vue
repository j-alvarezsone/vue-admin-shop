<script lang="ts" setup generic="T">
import type { GenericOption, TooltipPlacement } from "@/features/shared/types";
import type { CSSProperties } from "vue";
import { TOOLTIP_PLACEMENTS } from "@/features/shared/constants/tooltip";
import { useClipboard, useEventListener, useVirtualList } from "@vueuse/core";
import { ErrorMessage, useField } from "vee-validate";
import { computed, nextTick, onMounted, reactive, ref, toRef, useTemplateRef, watch } from "vue";
import BaseIcon from "../Icon.vue";
import Loader from "../Loader.vue";

interface Props {
  name: string
  label?: string
  placeholder?: string
  disabled?: boolean
  searchable?: boolean
  options: T[]
  size?: "sm" | "md" | "lg"
  clearable?: boolean
  searchClearable?: boolean
  standalone?: boolean
  required?: boolean
  loading?: boolean
  itemHeight?: number
  tooltip?: string
  tooltipPlacement?: TooltipPlacement
  copy?: boolean
  errorMessage?: string
  disableFilter?: boolean
  selectFirst?: boolean
  modelValue?: string
  filterBy?: string[]
  optionValue?: (option: T) => string
  optionLabel?: (option: T) => string
  optionDisabled?: (option: T) => boolean
}

const props = withDefaults(defineProps<Props>(), {
  label: undefined,
  placeholder: undefined,
  disabled: false,
  size: "md",
  searchable: false,
  clearable: false,
  searchClearable: true,
  standalone: false,
  required: true,
  loading: false,
  itemHeight: 44,
  tooltip: undefined,
  tooltipPlacement: TOOLTIP_PLACEMENTS.TOP,
  copy: false,
  errorMessage: undefined,
  disableFilter: false,
  selectFirst: false,
  modelValue: undefined,
  optionValue: undefined,
  optionLabel: undefined,
  optionDisabled: undefined,
  filterBy: undefined,
});

defineEmits<{
  "update:modelValue": [value: string]
}>();

const { value, handleBlur, handleChange, errors, setTouched, setErrors } = useField<string>(toRef(props, "name"), undefined, {
  standalone: props.standalone,
  syncVModel: true,
});

const search = defineModel<string>("search", { default: "" });

const isDropdownVisible = ref<boolean>(false);
const containerRef = useTemplateRef("containerRef");

const { copy: copyToClipBoard } = useClipboard();

function onCopyToClipboard() {
  if (!value.value) { return; }

  copyToClipBoard(value.value);
  // TODO - Uncomment this line when the notifySuccess function is available
  // notifySuccess(`Copied "${value.value}"`)
}

const filteredOptions = computed(() => {
  if (!search.value || props.disableFilter) { return props.options; }

  return props.options.filter((item) => {
    return toLabel(item).toString().toLowerCase().includes(search.value.toLowerCase()) || filterByObjectKey(item);
  });
});

const isSearchable = computed(() => {
  if (props.searchable && isDropdownVisible.value) {
    return true;
  }

  return false;
});

const { containerProps, wrapperProps, list } = useVirtualList(filteredOptions, {
  itemHeight: props.itemHeight,
});

const dropdownPositionStyle = reactive<CSSProperties>({ top: "0px", left: "0px", position: "absolute" });

async function updateDropdownPosition() {
  await nextTick();

  if (!containerRef.value || !containerProps.ref.value) { return; }

  const containerRect = containerRef.value.getBoundingClientRect();
  const containerWidth = containerRect.width;
  const dropdownHeight = containerProps.ref.value.offsetHeight;
  const viewportHeight = window.innerHeight;
  const spaceBelow = viewportHeight - containerRect.bottom;

  if (spaceBelow >= dropdownHeight) {
    dropdownPositionStyle.top = `${containerRect.bottom + window.scrollY}px`;
    dropdownPositionStyle.left = `${containerRect.left + window.scrollX}px`;
    dropdownPositionStyle.width = `${containerWidth}px`;
    dropdownPositionStyle.marginTop = "0.5rem";
  } else {
    dropdownPositionStyle.top = `${containerRect.top - dropdownHeight + window.scrollY}px`;
    dropdownPositionStyle.left = `${containerRect.left + window.scrollX}px`;
    dropdownPositionStyle.width = `${containerWidth}px`;
    dropdownPositionStyle.marginTop = props.label ? "1.5rem" : "-0.5rem";
  }
}

watch(isDropdownVisible, (newValue) => {
  if (newValue) {
    updateDropdownPosition();
  }
});

watch(
  () => props.errorMessage,
  (errorMessage) => {
    if (!errorMessage) { return; }

    setTouched(true);
    setErrors(errorMessage);
  },
  { immediate: true },
);

useEventListener(window, "resize", updateDropdownPosition);
useEventListener(window, "wheel", updateDropdownPosition);

useEventListener(containerRef, "keydown", (e) => {
  if (e.key === "Escape") {
    onClose();
  }
});

function onToggleOpen(e: Event) {
  if (props.disabled) { return; }

  const target = e.target as HTMLElement;

  if (target.closest(".chevron-icon")) {
    isDropdownVisible.value = !isDropdownVisible.value;

    return;
  }

  if (isSearchable.value) { return; }

  isDropdownVisible.value = !isDropdownVisible.value;
}

function onClose() {
  search.value = "";
  isDropdownVisible.value = false;
}

function isDefaultOptionType(option: T): option is GenericOption & T {
  return option && typeof option === "object" && ("label" in option || "value" in option);
}

function toValue(option: T) {
  if (props.optionValue) {
    return props.optionValue(option);
  }

  if (isDefaultOptionType(option)) {
    return option.value;
  }

  return JSON.stringify(option);
}

function toLabel(option: T) {
  if (props.optionLabel) {
    return props.optionLabel(option);
  }

  if (isDefaultOptionType(option)) {
    return option.label;
  }

  return JSON.stringify(option);
}

function toDisabled(option: T) {
  if (props.optionDisabled) {
    return props.optionDisabled(option);
  }

  return false;
}

function filterByObjectKey(item: any) {
  if (!props.filterBy) {
    return false;
  }

  return props.filterBy?.map((itemKey) => item[itemKey].toString().toLowerCase().includes(search.value.toLocaleLowerCase())).some(Boolean);
}

watch(
  () => wrapperProps.value.style.height,
  () => {
    updateDropdownPosition();
  },
  { flush: "post" },
);

function getSelectedOption(option: string) {
  const item = props.options?.find((o) => toValue(o) === option);

  return item ? toLabel(item) : "";
}

function selectOption(optionValue: string, option: T) {
  if (props.disabled || toDisabled(option)) { return; }

  onClose();
  handleChange(optionValue);
}

function onClearInput() {
  handleChange("");
}

function selectFirstOption() {
  if (value.value === "" || value.value === undefined || value.value === null) {
    if (props.options?.length) {
      handleChange(toValue(props.options[0]));
    }
  }
}

if (props.selectFirst) {
  onMounted(() => {
    selectFirstOption();
  });

  watch(
    () => props.options,
    () => {
      selectFirstOption();
    },
    { deep: true },
  );
}

const selectedOptionStyle = computed(() => {
  return [
    "flex items-center border w-full  py-2.5 px-3.5 focus:outline-hidden focus:outline-offset-0 gap-2 rounded-lg",
    // Sizes
    { "h-9": props.size === "sm" },
    { "h-10": props.size === "md" },
    { "h-11": props.size === "lg" },
    // Border && Ring
    { "border-gray-300": !errors.value.length && !isDropdownVisible.value },
    { "ring-3 ring-blue-300/50 border-blue-600": !errors.value.length && !props.disabled && !props.loading && isDropdownVisible.value },
    { "ring-3 ring-red-300/50 border-red-300": errors.value.length && !props.disabled && isDropdownVisible.value },
    { "border-red-500": errors.value.length && !props.disabled && !isDropdownVisible.value },
    // Text && Background
    { "text-gray-900": !props.disabled && (!!search.value || !!getSelectedOption(value.value)) },
    { "text-gray-500": !props.disabled && (!search.value || !getSelectedOption(value.value)) },
    { "bg-white": !props.disabled && !props.loading },
    { "cursor-not-allowed text-gray-500 bg-gray-50": props.disabled || props.loading },
    { "cursor-default": isSearchable.value },
  ];
});

const dropDownIconStyle = computed(() => {
  return [
    "size-5 shrink-0 order-4 grid place-content-center",
    { "transform rotate-0 transition-all duration-150 ease-in": !isDropdownVisible.value },
    { "transform rotate-180 transition-all duration-150 ease-in": isDropdownVisible.value },
    { "order-2": props.clearable },
    { "cursor-pointer": isSearchable.value },
  ];
});
</script>

<template>
  <div ref="containerRef" v-click-outside="onClose" class="gap-1.5 flex flex-col relative">
    <select :id="name" class="hidden" :name="name" :placeholder="placeholder" :disabled="disabled" :value="value" @change="handleChange" @blur="handleBlur" />
    <label v-if="label" :for="name" class="font-bold text-sm flex items-center gap-1 w-fit">
      <span class="first-letter:uppercase">{{ label }}</span>
      <span v-if="!required" class="text-tiny text-gray-500 italic">(Optional)</span>
    </label>
    <button
      type="button"
      :disabled="disabled" :class="selectedOptionStyle" @click="onToggleOpen"
    >
      <div v-if="loading" class="flex items-center gap-2">
        <Loader :is-text-visible="false" size="md" color="neutral" />
        <span v-if="loading" class="text-xs text-gray-500 animate-pulse">Getting data...</span>
      </div>
      <template v-else>
        <span v-show="!isSearchable" class="truncate w-full text-start">
          <slot name="selected-option" :value="value" :placeholder="placeholder" :selected-option="getSelectedOption">
            {{ getSelectedOption(value) || placeholder }}
          </slot>
        </span>
        <div v-if="isSearchable" class="flex items-center gap-2 w-full h-full">
          <span class="flex items-center justify-center shrink-0">
            <BaseIcon name="search" class="size-4 text-gray-400" />
          </span>
          <input
            :id="name"
            v-model="search"
            v-focus="true"
            type="text"
            placeholder="Search"
            class="grow focus:outline-hidden border-none placeholder-gray-500 truncate w-1/2"
            @keydown.esc="search = ''"
          >
          <span v-if="searchClearable && search && !disabled" class="cursor-pointer flex items-center gap-2 shrink-0 text-blue-500" @click.stop="search = ''">
            <BaseIcon class="size-3 fill-blue-500 cursor-pointer shrink-0" name="close" />
            Clear
          </span>
        </div>
        <span v-if="!isDropdownVisible && clearable && value && !disabled" class="flex order-1 shrink-0 items-center gap-2 text-blue-500" @click.stop="onClearInput">
          <BaseIcon class="size-3 fill-blue-500 cursor-pointer shrink-0" name="close" />
          Clear
        </span>
        <div v-if="tooltip && !errors.length" v-tooltip="{ content: tooltip, placement: tooltipPlacement }" class="cursor-help order-2 shrink-0">
          <BaseIcon name="question-circle" class="size-4 stroke-gray-400" />
        </div>
        <div v-if="copy && value" v-tooltip="'Copy'" class="cursor-pointer order-3 shrink-0">
          <BaseIcon class="size-4" name="copy" @click.stop="onCopyToClipboard" />
        </div>
        <div class="chevron-icon" :class="dropDownIconStyle" @click.stop="onToggleOpen">
          <BaseIcon name="chevron-down" :class="{ ' text-[#D0D5DD]': disabled }" />
        </div>
      </template>
    </button>
    <Teleport to="body">
      <Transition name="fade" mode="out-in">
        <div v-if="isDropdownVisible && !loading" class="z-999" :style="dropdownPositionStyle">
          <div v-bind="containerProps" class="bg-white border border-gray-100 rounded-lg w-full overflow-y-auto shadow-onWhite max-h-80 flex flex-col">
            <ul v-bind="wrapperProps">
              <li
                v-for="option in list"
                :key="toValue(option.data)"
                class="py-2.5 px-3.5 flex items-center gap-6 hover:bg-slate-100 text-base"
                :class="[
                  {
                    'bg-slate-100': toValue(option.data) === value,
                  },
                  toDisabled(option.data) ? 'cursor-not-allowed text-gray-400' : 'cursor-pointer ',
                ]"
                @click.stop="selectOption(toValue(option.data), option.data)"
              >
                <slot name="option-list" :option="option" :to-label="toLabel">
                  {{ toLabel(option.data) }}
                </slot>
                <slot name="option-icon" :option="option" :to-value="toValue" :value:="value">
                  <BaseIcon v-if="toValue(option.data) === value" name="check" class="size-5 shrink-0 ml-auto text-blue-600" />
                </slot>
              </li>
            </ul>
            <div v-if="!filteredOptions.length" class="flex flex-col items-center p-6 text-center">
              <span class="font-bold max-w-full">
                No {{ label ?? "item" }} found <span v-if="search" class="break-words">matching for "{{ search }}"</span>
              </span>
            </div>
          </div>
          <slot />
        </div>
      </Transition>
    </Teleport>
    <ErrorMessage v-if="!disabled && !loading" :name="name" class="text-red-500 absolute top-full mt-1.5" />
  </div>
</template>

<style scoped>
.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.5s;
  overflow: hidden;
}

.fade-enter,
.fade-leave-to {
  opacity: 0;
}

.fade-enter-to,
.fade-leave-from {
  opacity: 1;
}
</style>
