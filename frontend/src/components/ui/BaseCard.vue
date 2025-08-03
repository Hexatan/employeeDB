<template>
  <div
    :class="[
      'base-card',
      `base-card--${variant}`,
      {
        'base-card--hoverable': hoverable,
        'base-card--clickable': clickable,
        'base-card--bordered': bordered,
        'base-card--shadow': shadow
      }
    ]"
    @click="handleClick"
  >
    <!-- Header -->
    <div v-if="title || subtitle || $slots.header" class="base-card__header">
      <slot name="header">
        <div v-if="title || subtitle" class="base-card__header-content">
          <h3 v-if="title" class="base-card__title">{{ title }}</h3>
          <p v-if="subtitle" class="base-card__subtitle">{{ subtitle }}</p>
        </div>
      </slot>

      <div v-if="$slots.actions" class="base-card__actions">
        <slot name="actions" />
      </div>
    </div>

    <!-- Body -->
    <div v-if="$slots.default" class="base-card__body">
      <slot />
    </div>

    <!-- Footer -->
    <div v-if="$slots.footer" class="base-card__footer">
      <slot name="footer" />
    </div>
  </div>
</template>

<script setup lang="ts">
interface Props {
  title?: string
  subtitle?: string
  variant?: 'default' | 'primary' | 'success' | 'warning' | 'danger' | 'info'
  hoverable?: boolean
  clickable?: boolean
  bordered?: boolean
  shadow?: boolean
}

interface Emits {
  click: [event: MouseEvent]
}

const props = withDefaults(defineProps<Props>(), {
  variant: 'default',
  hoverable: false,
  clickable: false,
  bordered: true,
  shadow: true
})

const emit = defineEmits<Emits>()

const handleClick = (event: MouseEvent) => {
  if (props.clickable) {
    emit('click', event)
  }
}
</script>

<style scoped>
.base-card {
  background-color: #ffffff;
  border-radius: 8px;
  overflow: hidden;
  transition: all 0.2s ease-in-out;
}

.base-card--bordered {
  border: 1px solid #e5e7eb;
}

.base-card--shadow {
  box-shadow: 0 1px 3px 0 rgba(0, 0, 0, 0.1), 0 1px 2px 0 rgba(0, 0, 0, 0.06);
}

.base-card--hoverable:hover {
  transform: translateY(-2px);
  box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06);
}

.base-card--clickable {
  cursor: pointer;
}

.base-card--clickable:hover {
  transform: translateY(-1px);
  box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06);
}

/* Variants */
.base-card--primary {
  border-color: #007bff;
}

.base-card--primary .base-card__header {
  background-color: #f8f9ff;
  border-bottom-color: #007bff;
}

.base-card--success {
  border-color: #28a745;
}

.base-card--success .base-card__header {
  background-color: #f8fff9;
  border-bottom-color: #28a745;
}

.base-card--warning {
  border-color: #ffc107;
}

.base-card--warning .base-card__header {
  background-color: #fffef8;
  border-bottom-color: #ffc107;
}

.base-card--danger {
  border-color: #dc3545;
}

.base-card--danger .base-card__header {
  background-color: #fff8f8;
  border-bottom-color: #dc3545;
}

.base-card--info {
  border-color: #17a2b8;
}

.base-card--info .base-card__header {
  background-color: #f8feff;
  border-bottom-color: #17a2b8;
}

/* Header */
.base-card__header {
  padding: 16px 20px;
  background-color: #f9fafb;
  border-bottom: 1px solid #e5e7eb;
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 16px;
}

.base-card__header-content {
  flex: 1;
  min-width: 0;
}

.base-card__title {
  margin: 0;
  font-size: 18px;
  font-weight: 600;
  color: #374151;
  line-height: 1.4;
}

.base-card__subtitle {
  margin: 4px 0 0 0;
  font-size: 14px;
  color: #6b7280;
  line-height: 1.4;
}

.base-card__actions {
  display: flex;
  align-items: center;
  gap: 8px;
  flex-shrink: 0;
}

/* Body */
.base-card__body {
  padding: 20px;
}

/* Footer */
.base-card__footer {
  padding: 16px 20px;
  background-color: #f9fafb;
  border-top: 1px solid #e5e7eb;
}

/* Compact variant for smaller cards */
.base-card--compact .base-card__header {
  padding: 12px 16px;
}

.base-card--compact .base-card__body {
  padding: 16px;
}

.base-card--compact .base-card__footer {
  padding: 12px 16px;
}

.base-card--compact .base-card__title {
  font-size: 16px;
}

.base-card--compact .base-card__subtitle {
  font-size: 13px;
}

/* Responsive design */
@media (max-width: 768px) {
  .base-card__header {
    padding: 12px 16px;
    flex-direction: column;
    align-items: flex-start;
    gap: 12px;
  }

  .base-card__body {
    padding: 16px;
  }

  .base-card__footer {
    padding: 12px 16px;
  }

  .base-card__title {
    font-size: 16px;
  }

  .base-card__subtitle {
    font-size: 13px;
  }

  .base-card__actions {
    width: 100%;
    justify-content: flex-end;
  }
}

/* Special stat card styling */
.base-card--stat {
  text-align: center;
  border: none;
  background: linear-gradient(135deg, #f8f9fa 0%, #ffffff 100%);
}

.base-card--stat .base-card__body {
  padding: 24px 16px;
}

.base-card--stat .base-card__title {
  font-size: 14px;
  font-weight: 600;
  color: #6c757d;
  text-transform: uppercase;
  letter-spacing: 0.5px;
  margin-bottom: 8px;
}

.base-card--stat .base-card__value {
  font-size: 28px;
  font-weight: bold;
  color: #007bff;
  line-height: 1.2;
}

@media (max-width: 768px) {
  .base-card--stat .base-card__value {
    font-size: 24px;
  }
}
</style>
