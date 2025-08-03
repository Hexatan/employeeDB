<template>
  <div class="base-input">
    <label v-if="label" :for="inputId" class="base-input__label">
      {{ label }}
      <span v-if="required" class="base-input__required">*</span>
    </label>

    <div class="base-input__wrapper">
      <input
        :id="inputId"
        :type="type"
        :placeholder="placeholder"
        :disabled="disabled"
        :readonly="readonly"
        :class="[
          'base-input__field',
          {
            'base-input__field--error': hasError,
            'base-input__field--success': hasSuccess,
            'base-input__field--disabled': disabled
          }
        ]"
        :value="modelValue"
        @input="handleInput"
        @blur="handleBlur"
        @focus="handleFocus"
        @keyup.enter="handleEnter"
        @keyup.escape="handleEscape"
      />

      <div v-if="hasError || hasSuccess" class="base-input__icon">
        <span v-if="hasError" class="base-input__icon--error">⚠</span>
        <span v-if="hasSuccess" class="base-input__icon--success">✓</span>
      </div>
    </div>

    <div v-if="errorMessage || successMessage || helperText" class="base-input__message">
      <span v-if="errorMessage" class="base-input__error">{{ errorMessage }}</span>
      <span v-else-if="successMessage" class="base-input__success">{{ successMessage }}</span>
      <span v-else class="base-input__helper">{{ helperText }}</span>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed, ref } from 'vue'

interface Props {
  modelValue?: string | number
  type?: 'text' | 'email' | 'password' | 'number' | 'tel' | 'url' | 'search'
  label?: string
  placeholder?: string
  helperText?: string
  errorMessage?: string
  successMessage?: string
  disabled?: boolean
  readonly?: boolean
  required?: boolean
}

interface Emits {
  'update:modelValue': [value: string | number]
  blur: [event: FocusEvent]
  focus: [event: FocusEvent]
  enter: [event: KeyboardEvent]
  escape: [event: KeyboardEvent]
}

const props = withDefaults(defineProps<Props>(), {
  type: 'text',
  disabled: false,
  readonly: false,
  required: false
})

const emit = defineEmits<Emits>()

const inputId = ref(`input-${Math.random().toString(36).substr(2, 9)}`)

const hasError = computed(() => !!props.errorMessage)
const hasSuccess = computed(() => !!props.successMessage)

const handleInput = (event: Event) => {
  const target = event.target as HTMLInputElement
  const value = props.type === 'number' ? Number(target.value) : target.value
  emit('update:modelValue', value)
}

const handleBlur = (event: FocusEvent) => {
  emit('blur', event)
}

const handleFocus = (event: FocusEvent) => {
  emit('focus', event)
}

const handleEnter = (event: KeyboardEvent) => {
  emit('enter', event)
}

const handleEscape = (event: KeyboardEvent) => {
  emit('escape', event)
}
</script>

<style scoped>
.base-input {
  display: flex;
  flex-direction: column;
  gap: 4px;
}

.base-input__label {
  font-size: 14px;
  font-weight: 500;
  color: #374151;
  margin-bottom: 4px;
}

.base-input__required {
  color: #dc3545;
}

.base-input__wrapper {
  position: relative;
  display: flex;
  align-items: center;
}

.base-input__field {
  width: 100%;
  padding: 8px 12px;
  border: 1px solid #d1d5db;
  border-radius: 4px;
  font-size: 14px;
  line-height: 1.5;
  color: #374151;
  background-color: #ffffff;
  transition: all 0.2s ease-in-out;
}

.base-input__field:focus {
  outline: none;
  border-color: #007bff;
  box-shadow: 0 0 0 3px rgba(0, 123, 255, 0.1);
}

.base-input__field::placeholder {
  color: #9ca3af;
}

.base-input__field--error {
  border-color: #dc3545;
  padding-right: 40px;
}

.base-input__field--error:focus {
  border-color: #dc3545;
  box-shadow: 0 0 0 3px rgba(220, 53, 69, 0.1);
}

.base-input__field--success {
  border-color: #28a745;
  padding-right: 40px;
}

.base-input__field--success:focus {
  border-color: #28a745;
  box-shadow: 0 0 0 3px rgba(40, 167, 69, 0.1);
}

.base-input__field--disabled {
  background-color: #f3f4f6;
  color: #9ca3af;
  cursor: not-allowed;
}

.base-input__icon {
  position: absolute;
  right: 12px;
  display: flex;
  align-items: center;
  pointer-events: none;
}

.base-input__icon--error {
  color: #dc3545;
  font-size: 16px;
}

.base-input__icon--success {
  color: #28a745;
  font-size: 16px;
}

.base-input__message {
  font-size: 12px;
  line-height: 1.4;
}

.base-input__error {
  color: #dc3545;
}

.base-input__success {
  color: #28a745;
}

.base-input__helper {
  color: #6b7280;
}

/* Responsive adjustments */
@media (max-width: 768px) {
  .base-input__field {
    padding: 10px 12px;
    font-size: 16px; /* Prevents zoom on iOS */
  }
}
</style>
