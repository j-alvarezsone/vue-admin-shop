<script setup lang="ts">
import { ErrorMessage, useField } from "vee-validate";
import { computed, toRef, useSlots, useTemplateRef } from "vue";

interface Props {
  name: string
  label?: string
  placeholder?: string
  required?: boolean
  focus?: boolean
  standalone?: boolean
  helpText?: string
  rows?: string
  disabled?: boolean
  modelValue?: string
}

const props = withDefaults(defineProps<Props>(), {
  label: undefined,
  placeholder: undefined,
  required: true,
  focus: false,
  standalone: false,
  helpText: undefined,
  disabled: false,
  rows: "5",
  modelValue: undefined,
});

defineEmits<{
  "update:modelValue": [value: string]
}>();

const slot = useSlots();
useTemplateRef("inputRef");

const { value, handleChange, handleBlur, errors } = useField<string>(toRef(props, "name"), undefined, {
  standalone: props.standalone,
  syncVModel: true,
});

const style = computed(() => {
  return [
    "w-full border text-base rounded-lg focus:ring-3 block py-2.5 px-3.5 focus:outline-hidden focus:outline-offset-0 placeholder:text-gray-500 resize-none",
    { "bg-gray-50 text-gray-500": props.disabled },
    { "bg-white text-gray-900": !props.disabled },
    // Border
    { "border-gray-300 focus:ring-blue-300/50 focus:border-blue-600": !errors.value.length },
    { "focus:ring-red-300/50 border-red-500": errors.value.length && !props.disabled },
    { "cursor-not-allowed": props.disabled },
  ];
});
</script>

<template>
  <div class="flex flex-col gap-1.5 relative">
    <label v-if="label" :for="name" class="font-roboto-medium text-sm flex items-center gap-1 w-fit">
      <span class="first-letter:uppercase">{{ label }}</span>
      <span v-if="!required" class="text-tiny text-gray-500 italic">(Optional)</span>
    </label>
    <textarea
      :id="name"
      ref="inputRef"
      v-focus="focus"
      :value="value"
      :class="style"
      :placeholder="placeholder"
      autocomplete="off"
      :rows="rows"
      :disabled="disabled"
      @input="handleChange"
      @blur="handleBlur"
      @keydown.esc="handleChange('')"
    />
    <slot v-if="(helpText && !errors.length) || (slot.helpText && !errors.length)" name="helpText">
      <p class="first-letter:uppercase">
        {{ helpText }}
      </p>
    </slot>
    <ErrorMessage v-if="!disabled" :name="name" class="text-red-500" />
  </div>
</template>
