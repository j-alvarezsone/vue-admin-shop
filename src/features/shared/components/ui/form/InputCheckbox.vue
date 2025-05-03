<script setup lang="ts">
import { useField } from "vee-validate";
import { computed, toRef } from "vue";
import BaseIcon from "../Icon.vue";

interface Props {
  name: string
  label?: string
  checkedValue: string | boolean | number
  uncheckedValue?: string | boolean | number
  description?: string
  disabled?: boolean
  size?: "sm" | "md"
  modelValue?: string | boolean | number
}

const props = withDefaults(defineProps<Props>(), {
  label: undefined,
  description: undefined,
  disabled: false,
  size: "md",
  uncheckedValue: false,
  modelValue: undefined,
});

defineEmits<{
  "update:modelValue": [value: string | boolean | number]
}>();

const { checked, handleChange, setErrors, setTouched } = useField<string | boolean | number>(toRef(props, "name"), undefined, {
  type: "checkbox",
  checkedValue: props.checkedValue,
  uncheckedValue: props.uncheckedValue,
  syncVModel: true,
});

function onHandleChange() {
  if (props.disabled) { return; }
  handleChange(!checked?.value);
}

const style = computed(() => {
  return [
    "group w-max",
    // space
    { "cursor-pointer": !props.disabled },
    { "cursor-not-allowed": props.disabled },
  ];
});

const buttonStyle = computed(() => {
  return [
    "border rounded-md grid place-content-center outline-hidden shrink-0",
    // hover & focus
    { "group-hover:bg-blue-50 focus:ring-3 focus:ring-blue-300/50 hover:border-blue-600": !props.disabled },
    // disabled
    { "border-gray-200 bg-gray-100 cursor-not-allowed": props.disabled },
    // checked
    { "border-blue-600 bg-blue-50 group-hover:border-blue-600": checked?.value },
    // unchecked
    { "border-gray-300 focus:border-blue-300": !checked?.value && !props.disabled },
    // size
    { "size-4": props.size === "sm" },
    { "size-5": props.size === "md" },
  ];
});

const labelStyle = computed(() => {
  return [
    "text-sm font-roboto-medium",
    { "text-sm": props.size === "sm" },
    { "text-base": props.size === "md" },
    { "cursor-not-allowed text-gray-500": props.disabled },
    { "cursor-pointer": !props.disabled },
  ];
});

const iconStyle = computed(() => {
  return [
    { "text-blue-600": checked?.value },
    { "hidden group-hover:block text-gray-400": !checked?.value },
    // size
    { "size-2": props.size === "sm" },
    { "size-4": props.size === "md" },
  ];
});

const descriptionStyle = computed(() => {
  return [
    "text-gray-500 w-fit",
    // font size & margin
    { "text-xs": props.size === "sm" },
    { "text-sm": props.size === "md" },
    { "ml-6": props.size === "sm" },
    { "ml-8": props.size === "md" },
  ];
});

defineExpose({
  setErrors,
  setTouched,
});
</script>

<template>
  <div :class="style" tabindex="0">
    <input :id="`${name}-${checkedValue}`" :name="name" type="checkbox" :checked="checked" class="hidden" :disabled="disabled" @click="onHandleChange">
    <label :for="`${name}-${checkedValue}`" :class="labelStyle" class="flex items-center gap-2">
      <button type="button" :class="buttonStyle" @click="onHandleChange">
        <BaseIcon name="check" :class="iconStyle" />
      </button>
      <slot name="label">
        <span v-if="label">
          {{ label }}
        </span>
      </slot>
    </label>
    <p v-if="description" :for="name" :class="descriptionStyle">
      {{ description }}
    </p>
  </div>
</template>
