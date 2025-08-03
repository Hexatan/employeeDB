<template>
  <Transition
    name="alert"
    enter-active-class="alert-enter-active"
    leave-active-class="alert-leave-active"
    enter-from-class="alert-enter-from"
    leave-to-class="alert-leave-to"
  >
    <div
      v-if="visible"
      :class="[
        'base-alert',
        `base-alert--${variant}`,
        {
          'base-alert--dismissible': dismissible,
          'base-alert--bordered': bordered,
          'base-alert--filled': filled
        }
      ]"
      role="alert"
    >
      <div class="base-alert__content">
        <!-- Icon -->
        <div v-if="showIcon" class="base-alert__icon">
          <slot name="icon">
            <span v-if="variant === 'success'">✓</span>
            <span v-else-if="variant === 'warning'">⚠</span>
            <span v-else-if="variant === 'danger'">✕</span>
            <span v-else-if="variant === 'info'">ℹ</span>
            <span v-else>•</span>
          </slot>
        </div>

        <!-- Message content -->
        <div class="base-alert__message">
          <div v-if="title" class="base-alert__title">{{ title }}</div>
          <div class="base-alert__text">
            <slot>{{ message }}</slot>
          </div>
        </div>

        <!-- Actions -->
        <div v-if="$slots.actions" class="base-alert__actions">
          <slot name="actions" />
        </div>

        <!-- Dismiss button -->
        <button
          v-if="dismissible"
          class="base-alert__dismiss"
          type="button"
          @click="handleDismiss"
          aria-label="Dismiss alert"
        >
          <span>×</span>
        </button>
      </div>
    </div>
  </Transition>
</template>

<script setup lang="ts">
import { ref, watch } from 'vue'

interface Props {
  variant?: 'default' | 'success' | 'warning' | 'danger' | 'info'
  title?: string
  message?: string
  dismissible?: boolean
  bordered?: boolean
  filled?: boolean
  showIcon?: boolean
  modelValue?: boolean
  autoClose?: number // Auto close after X milliseconds
}

interface Emits {
  'update:modelValue': [value: boolean]
  dismiss: []
  close: []
}

const props = withDefaults(defineProps<Props>(), {
  variant: 'default',
  dismissible: false,
  bordered: true,
  filled: false,
  showIcon: true,
  modelValue: true,
  autoClose: 0
})

const emit = defineEmits<Emits>()

const visible = ref(props.modelValue)

// Watch for external changes to modelValue
watch(() => props.modelValue, (newValue) => {
  visible.value = newValue
})

// Watch for changes to visible and emit updates
watch(visible, (newValue) => {
  emit('update:modelValue', newValue)
  if (!newValue) {
    emit('close')
  }
})

// Auto close functionality
if (props.autoClose > 0) {
  setTimeout(() => {
    handleDismiss()
  }, props.autoClose)
}

const handleDismiss = () => {
  visible.value = false
  emit('dismiss')
}
</script>

<style scoped>
.base-alert {
  border-radius: 6px;
  padding: 12px 16px;
  margin-bottom: 16px;
  position: relative;
}

.base-alert--bordered {
  border: 1px solid;
}

.base-alert__content {
  display: flex;
  align-items: flex-start;
  gap: 12px;
}

.base-alert__icon {
  flex-shrink: 0;
  width: 20px;
  height: 20px;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 16px;
  font-weight: bold;
  margin-top: 1px;
}

.base-alert__message {
  flex: 1;
  min-width: 0;
}

.base-alert__title {
  font-weight: 600;
  font-size: 14px;
  margin-bottom: 4px;
  line-height: 1.4;
}

.base-alert__text {
  font-size: 14px;
  line-height: 1.5;
}

.base-alert__actions {
  display: flex;
  align-items: center;
  gap: 8px;
  flex-shrink: 0;
  margin-top: 2px;
}

.base-alert__dismiss {
  flex-shrink: 0;
  background: none;
  border: none;
  font-size: 20px;
  line-height: 1;
  cursor: pointer;
  padding: 0;
  width: 20px;
  height: 20px;
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 2px;
  transition: all 0.2s ease-in-out;
  margin-top: 1px;
}

.base-alert__dismiss:hover {
  background-color: rgba(0, 0, 0, 0.1);
}

/* Variants - Default */
.base-alert--default {
  background-color: #f8f9fa;
  color: #495057;
}

.base-alert--default.base-alert--bordered {
  border-color: #dee2e6;
}

.base-alert--default.base-alert--filled {
  background-color: #6c757d;
  color: white;
}

.base-alert--default .base-alert__icon {
  color: #6c757d;
}

/* Variants - Success */
.base-alert--success {
  background-color: #d4edda;
  color: #155724;
}

.base-alert--success.base-alert--bordered {
  border-color: #c3e6cb;
}

.base-alert--success.base-alert--filled {
  background-color: #28a745;
  color: white;
}

.base-alert--success .base-alert__icon {
  color: #28a745;
}

.base-alert--success.base-alert--filled .base-alert__icon {
  color: white;
}

/* Variants - Warning */
.base-alert--warning {
  background-color: #fff3cd;
  color: #856404;
}

.base-alert--warning.base-alert--bordered {
  border-color: #ffeaa7;
}

.base-alert--warning.base-alert--filled {
  background-color: #ffc107;
  color: #212529;
}

.base-alert--warning .base-alert__icon {
  color: #ffc107;
}

.base-alert--warning.base-alert--filled .base-alert__icon {
  color: #212529;
}

/* Variants - Danger */
.base-alert--danger {
  background-color: #f8d7da;
  color: #721c24;
}

.base-alert--danger.base-alert--bordered {
  border-color: #f5c6cb;
}

.base-alert--danger.base-alert--filled {
  background-color: #dc3545;
  color: white;
}

.base-alert--danger .base-alert__icon {
  color: #dc3545;
}

.base-alert--danger.base-alert--filled .base-alert__icon {
  color: white;
}

/* Variants - Info */
.base-alert--info {
  background-color: #d1ecf1;
  color: #0c5460;
}

.base-alert--info.base-alert--bordered {
  border-color: #bee5eb;
}

.base-alert--info.base-alert--filled {
  background-color: #17a2b8;
  color: white;
}

.base-alert--info .base-alert__icon {
  color: #17a2b8;
}

.base-alert--info.base-alert--filled .base-alert__icon {
  color: white;
}

/* Transitions */
.alert-enter-active,
.alert-leave-active {
  transition: all 0.3s ease-in-out;
}

.alert-enter-from {
  opacity: 0;
  transform: translateY(-10px);
}

.alert-leave-to {
  opacity: 0;
  transform: translateY(-10px);
}

/* Responsive design */
@media (max-width: 768px) {
  .base-alert {
    padding: 10px 12px;
    margin-bottom: 12px;
  }

  .base-alert__content {
    gap: 10px;
  }

  .base-alert__title {
    font-size: 13px;
  }

  .base-alert__text {
    font-size: 13px;
  }

  .base-alert__actions {
    flex-direction: column;
    align-items: stretch;
    gap: 6px;
    margin-top: 8px;
  }
}

/* Compact variant */
.base-alert--compact {
  padding: 8px 12px;
  margin-bottom: 8px;
}

.base-alert--compact .base-alert__content {
  gap: 8px;
}

.base-alert--compact .base-alert__icon {
  width: 16px;
  height: 16px;
  font-size: 14px;
}

.base-alert--compact .base-alert__title {
  font-size: 13px;
  margin-bottom: 2px;
}

.base-alert--compact .base-alert__text {
  font-size: 13px;
}

.base-alert--compact .base-alert__dismiss {
  width: 16px;
  height: 16px;
  font-size: 16px;
}
</style>
