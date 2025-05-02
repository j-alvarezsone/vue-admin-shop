<script setup lang="ts">
import type { TooltipPlacement } from "@/features/shared/types";
import type { IconName } from "@/icons/types";
import { TOOLTIP_PLACEMENTS } from "@/features/shared/constants/tooltip";
import { useClipboard } from "@vueuse/core";
import { ErrorMessage, useField } from "vee-validate";
import { computed, ref, toRef, useSlots, useTemplateRef, watch } from "vue";
import { useToast } from "vue-toastification";
import BaseIcon from "../Icon.vue";
import Loader from "../Loader.vue";

interface Props {
  name: string
  placeholder?: string
  label?: string
  required?: boolean
  focus?: boolean
  type?: "text" | "number"
  tooltip?: string
  tooltipPlacement?: TooltipPlacement
  icon?: IconName
  iconPos?: "left" | "right"
  size?: "sm" | "md" | "lg" | "xl"
  iconSize?: string
  standalone?: boolean
  helpText?: string
  disabled?: boolean
  readonly?: boolean
  copy?: boolean
  noBorder?: boolean
  loading?: boolean
  clearable?: boolean
  onePassword?: boolean
  min?: string
  max?: string
  bgColor?: string
  modelValue?: string | number
  errorMessage?: string
  edit?: boolean
}

const props = withDefaults(defineProps<Props>(), {
  placeholder: undefined,
  label: undefined,
  required: true,
  focus: false,
  type: "text",
  tooltip: undefined,
  icon: undefined,
  iconPos: "left",
  size: "md",
  iconSize: "size-4",
  standalone: false,
  helpText: undefined,
  disabled: false,
  readonly: false,
  copy: false,
  noBorder: false,
  loading: false,
  clearable: false,
  onePassword: false,
  min: undefined,
  max: undefined,
  bgColor: undefined,
  modelValue: undefined,
  errorMessage: undefined,
  edit: false,
  tooltipPlacement: TOOLTIP_PLACEMENTS.TOP,
});

defineEmits<{
  "update:modelValue": [value: string]
}>();

const slot = useSlots();
const toast = useToast();

const { value, handleChange, handleBlur, errors, setErrors, setTouched } = useField<string>(toRef(props, "name"), undefined, {
  standalone: props.standalone,
  syncVModel: true,
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

const isFocused = ref<boolean>(false);
const inputRef = useTemplateRef("inputRef");

function onHandleChange(e: Event) {
  const target = e.target as HTMLInputElement;
  if (target) {
    if (props.type === "number" && target.value !== "") {
      handleChange(Number(target.value));
    } else {
      handleChange(target.value);
    }
  }
}

function onHandleClear() {
  handleChange("");
}

function onHandleFocus() {
  isFocused.value = true;
}

function handleIconClick() {
  if (!props.edit) { return; }

  inputRef.value?.focus();
}

function onHandleBlur() {
  handleBlur();
  isFocused.value = false;
}

const { copy: copyToClipBoard } = useClipboard();

function onCopyToClipboard() {
  if (!value.value) { return; }

  copyToClipBoard(value.value);
  toast.success(`Copied "${value.value}"`);
}

const style = computed(() => {
  return [
    "flex items-center gap-2 w-full rounded-lg py-2.5 px-3.5",
    { "bg-gray-50 text-gray-500": props.disabled || props.loading },
    { "bg-white text-gray-900": !props.disabled && !props.loading && !props.bgColor },
    props.bgColor,
    // Sizes
    { "h-9 text-base": props.size === "sm" },
    { "h-10 text-base": props.size === "md" },
    { "h-11 text-lg": props.size === "lg" },
    { "h-12 text-xl": props.size === "xl" },
    // Border
    { "border border-gray-300": !errors.value.length && !props.noBorder && !isFocused.value },
    { "ring-3 ring-blue-300/50 border border-blue-600": !errors.value.length && !props.noBorder && isFocused.value },
    { "ring-3 ring-red-300/50 border border-red-500": errors.value.length && !props.disabled && isFocused.value },
    { "border border-red-500": errors.value.length && !props.disabled && !isFocused.value },
    { "cursor-not-allowed": props.disabled || props.loading },
  ];
});
</script>

<template>
  <div class="flex flex-col gap-1.5 relative">
    <slot name="label">
      <label v-if="label" :for="name" class="font-bold text-sm flex items-center gap-1 w-fit">
        <span class="first-letter:uppercase">{{ label }}</span>
        <span v-if="!required" class="text-tiny text-gray-500 italic">(Optional)</span>
      </label>
    </slot>
    <div :class="style">
      <template v-if="loading">
        <div class="flex items-center gap-2 flex-1">
          <Loader :is-text-visible="false" size="md" color="neutral" />
          <slot name="loading-message">
            <span class="grow text-xs text-gray-500 animate-pulse">Getting data...</span>
          </slot>
        </div>
      </template>
      <template v-else>
        <div
          v-if="icon && !errors.length && !loading"
          class="grid place-content-center shrink-0"
          :class="{ 'order-1': iconPos === 'right', 'cursor-pointer': edit }"
          @click="handleIconClick"
        >
          <BaseIcon :name="icon" :class="iconSize" />
        </div>
        <input
          :id="name"
          ref="inputRef"
          v-focus="focus"
          :type="type"
          :value="value"
          class="flex-1 focus:outline-hidden focus:outline-offset-0 truncate placeholder:text-gray-500 min-w-0"
          :class="[{ 'cursor-not-allowed': disabled }, bgColor]"
          :placeholder="placeholder"
          autocomplete="off"
          :disabled="disabled"
          :readonly="readonly"
          :data-1p-ignore="!onePassword"
          :min="min"
          :max="max"
          @input="onHandleChange"
          @blur="onHandleBlur"
          @focus="onHandleFocus"
          @keydown.esc="onHandleClear"
        >
        <div v-if="errors.length && !disabled" class="grid place-content-center shrink-0 order-2">
          <BaseIcon name="error-outline" class="size-4 text-red-500" />
        </div>
        <template v-else>
          <div
            v-if="clearable && value && !disabled"
            class="cursor-pointer flex items-center gap-2 shrink-0 text-blue-500"
            :class="{ 'order-2': iconPos === 'right' }"
            @click="onHandleClear"
          >
            <BaseIcon name="close" class="size-3" />
            Clear
          </div>
          <div
            v-if="tooltip && !errors.length"
            v-tooltip="{ content: tooltip, placement: tooltipPlacement }"
            class="cursor-help grid place-content-center shrink-0"
            :class="{ 'order-3': iconPos === 'right' }"
          >
            <BaseIcon name="question-circle" class="size-4 stroke-gray-400" />
          </div>
          <div v-if="copy && value" v-tooltip="'Copy'" class="cursor-pointer grid place-content-center shrink-0" :class="{ 'order-4': iconPos === 'right' }">
            <BaseIcon name="copy" class="size-4" @click="onCopyToClipboard" />
          </div>
        </template>
      </template>
    </div>
    <slot v-if="(helpText && !errors.length) || (slot.helpText && !errors.length)" name="helpText">
      <p class="first-letter:uppercase">
        {{ helpText }}
      </p>
    </slot>
    <ErrorMessage :name="name" class="text-red-500" />
  </div>
</template>

<style scoped>
input:disabled {
  background-color: #f9fafb;
}

:slotted(p::first-letter) {
  text-transform: uppercase;
}

.input-center input {
  text-align: center;
}
</style>
