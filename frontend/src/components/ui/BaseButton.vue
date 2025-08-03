<template>
  <button
    :class="[
      'base-button',
      `base-button--${variant}`,
      `base-button--${size}`,
      {
        'base-button--disabled': disabled,
        'base-button--loading': loading,
      },
    ]"
    :disabled="disabled || loading"
    @click="handleClick"
  >
    <span v-if="loading" class="base-button__spinner"></span>
    <slot v-else />
  </button>
</template>

<script setup lang="ts">
import type { ButtonVariant, ComponentSize } from './index'

interface Props {
  variant?: ButtonVariant
  size?: ComponentSize
  disabled?: boolean
  loading?: boolean
}

interface Emits {
  click: [event: MouseEvent]
}

const props = withDefaults(defineProps<Props>(), {
  variant: 'primary',
  size: 'medium',
  disabled: false,
  loading: false,
})

const emit = defineEmits<Emits>()

const handleClick = (event: MouseEvent) => {
  if (!props.disabled && !props.loading) {
    emit('click', event)
  }
}
</script>

<style scoped>
.base-button {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  border: 1px solid transparent;
  border-radius: 4px;
  cursor: pointer;
  font-weight: 500;
  text-decoration: none;
  transition: all 0.2s ease-in-out;
  position: relative;
  font-family: inherit;
}

.base-button:focus {
  outline: 2px solid transparent;
  outline-offset: 2px;
  box-shadow: 0 0 0 2px rgba(59, 130, 246, 0.5);
}

/* Sizes */
.base-button--small {
  padding: 4px 8px;
  font-size: 12px;
  min-height: 28px;
}

.base-button--medium {
  padding: 6px 12px;
  font-size: 14px;
  min-height: 36px;
}

.base-button--large {
  padding: 8px 16px;
  font-size: 16px;
  min-height: 44px;
}

/* Variants */
.base-button--primary {
  background-color: #007bff;
  color: white;
}

.base-button--primary:hover:not(.base-button--disabled):not(.base-button--loading) {
  background-color: #0056b3;
}

.base-button--secondary {
  background-color: #6c757d;
  color: white;
}

.base-button--secondary:hover:not(.base-button--disabled):not(.base-button--loading) {
  background-color: #545b62;
}

.base-button--success {
  background-color: #28a745;
  color: white;
}

.base-button--success:hover:not(.base-button--disabled):not(.base-button--loading) {
  background-color: #1e7e34;
}

.base-button--danger {
  background-color: #dc3545;
  color: white;
}

.base-button--danger:hover:not(.base-button--disabled):not(.base-button--loading) {
  background-color: #c82333;
}

.base-button--warning {
  background-color: #ffc107;
  color: #212529;
}

.base-button--warning:hover:not(.base-button--disabled):not(.base-button--loading) {
  background-color: #e0a800;
}

.base-button--info {
  background-color: #17a2b8;
  color: white;
}

.base-button--info:hover:not(.base-button--disabled):not(.base-button--loading) {
  background-color: #138496;
}

.base-button--outline {
  background-color: transparent;
  color: #007bff;
  border: 1px solid #007bff;
}

.base-button--outline:hover:not(.base-button--disabled):not(.base-button--loading) {
  background-color: #007bff;
  color: white;
}

/* States */
.base-button--disabled {
  opacity: 0.6;
  cursor: not-allowed;
}

.base-button--loading {
  cursor: not-allowed;
}

.base-button__spinner {
  width: 16px;
  height: 16px;
  border: 2px solid transparent;
  border-top: 2px solid currentColor;
  border-radius: 50%;
  animation: spin 1s linear infinite;
}

@keyframes spin {
  to {
    transform: rotate(360deg);
  }
}
</style>
