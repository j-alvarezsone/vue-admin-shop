<script setup lang="ts">
import { useClipboard } from "@vueuse/core";
import { ErrorMessage, useField } from "vee-validate";
import { computed, ref, toRef, useSlots } from "vue";

import BaseIcon from "../Icon.vue";
import Loader from "../Loader.vue";

interface Props {
  name: string
  placeholder?: string
  label?: string
  required?: boolean
  focus?: boolean
  tooltip?: string
  size?: "sm" | "md" | "lg"
  iconSize?: string
  standalone?: boolean
  helpText?: string
  disabled?: boolean
  readonly?: boolean
  copy?: boolean
  loading?: boolean
  clearable?: boolean
  onePassword?: boolean
  bgColor?: string
  modelValue?: string
}

const props = withDefaults(defineProps<Props>(), {
  placeholder: undefined,
  label: undefined,
  required: true,
  focus: false,
  tooltip: undefined,
  size: "md",
  iconSize: "size-4",
  standalone: false,
  helpText: undefined,
  disabled: false,
  readonly: false,
  copy: false,
  loading: false,
  clearable: false,
  onePassword: false,
  bgColor: undefined,
  modelValue: undefined,
});

defineEmits<{
  "update:modelValue": [value: string]
}>();

const slot = useSlots();

const { value, handleChange, handleBlur, errors } = useField<string>(toRef(props, "name"), undefined, {
  standalone: props.standalone,
  syncVModel: true,
});

const isFocused = ref<boolean>(false);

function onHandleChange(e: Event) {
  const target = e.target as HTMLInputElement;
  if (target) {
    handleChange(target.value);
  }
}

function onHandleClear() {
  handleChange("");
}

function onHandleFocus() {
  isFocused.value = true;
}

function onHandleBlur() {
  handleBlur();
  isFocused.value = false;
}

const { copy: copyToClipBoard } = useClipboard();

function onCopyToClipboard() {
  if (!value.value) { return; }

  copyToClipBoard(value.value);
}

const style = computed(() => {
  return [
    "flex items-center gap-2 w-full rounded-lg py-2.5 px-3.5",
    { "bg-gray-50 text-gray-500": props.disabled || props.loading },
    { "text-gray-900": !props.disabled && !props.loading },
    { "bg-white": !props.disabled && !props.loading && !props.bgColor },
    props.bgColor,
    // Sizes
    { "h-9 text-base": props.size === "sm" },
    { "h-10 text-base": props.size === "md" },
    { "h-11 text-lg": props.size === "lg" },
    // Border
    { "border border-gray-300": !errors.value.length && !isFocused.value },
    { "ring-3 ring-blue-300/50 border border-blue-600": !errors.value.length && isFocused.value },
    { "ring-3 ring-red-300/50 border border-red-500": errors.value.length && !props.disabled && isFocused.value },
    { "border border-red-500": errors.value.length && !props.disabled && !isFocused.value },
    { "cursor-not-allowed": props.disabled || props.loading },
  ];
});
</script>

<template>
  <div class="flex flex-col gap-1.5 relative">
    <label v-if="label" :for="name" class="font-bold text-sm flex items-center gap-1 w-fit">
      <span class="first-letter:uppercase">{{ label }}</span>
      <span v-if="!required" class="text-tiny text-gray-500 italic">(Optional)</span>
    </label>
    <div :class="style">
      <template v-if="loading">
        <div class="flex items-center gap-2 flex-1">
          <Loader :is-text-visible="false" size="md" color="neutral" />
          <span class="grow text-xs text-gray-500 animate-pulse">Getting data...</span>
        </div>
      </template>
      <template v-else>
        <div class="grid place-content-center shrink-0">
          <BaseIcon name="email" :class="iconSize" />
        </div>
        <input
          :id="name"
          v-focus="focus"
          type="'email'novalidate/"
          :value="value"
          class="flex-1 focus:outline-hidden focus:outline-offset-0 truncate placeholder:text-gray-500"
          :class="[{ 'cursor-not-allowed': disabled }, bgColor]"
          :placeholder="placeholder"
          autocomplete="off"
          :disabled="disabled"
          :readonly="readonly"
          :data-1p-ignore="!onePassword"
          @input="onHandleChange"
          @blur="onHandleBlur"
          @focus="onHandleFocus"
          @keydown.esc="onHandleClear"
        >
        <div v-if="errors.length && !disabled" class="grid place-content-center shrink-0 order-2">
          <BaseIcon name="error-outline" class="size-4 text-red-500" fill-svg="fill-transparent" />
        </div>
        <template v-else>
          <div v-if="clearable && value && !disabled" class="cursor-pointer flex items-center gap-2 shrink-0 text-blue-500" @click="onHandleClear">
            <BaseIcon name="close" class="size-3" />
            Clear
          </div>
          <div v-if="tooltip && !errors.length" class="cursor-help grid place-content-center shrink-0">
            <BaseIcon v-tooltip="tooltip" name="question-circle" class="size-4 stroke-gray-400" fill-svg="fill-transparent" />
          </div>
          <div v-if="copy && value" class="cursor-pointer grid place-content-center shrink-0">
            <BaseIcon v-tooltip="'Copy'" name="copy" class="size-4" @click="onCopyToClipboard" />
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
</style>
