<template>
  <div
    :class="[
      'base-loading',
      `base-loading--${variant}`,
      {
        'base-loading--overlay': overlay,
        'base-loading--fullscreen': fullscreen,
      },
    ]"
  >
    <div class="base-loading__content">
      <!-- Spinner -->
      <div
        :class="[
          'base-loading__spinner',
          `base-loading__spinner--${size}`,
          `base-loading__spinner--${spinnerType}`,
        ]"
      >
        <div v-if="spinnerType === 'dots'" class="base-loading__dots">
          <div class="base-loading__dot"></div>
          <div class="base-loading__dot"></div>
          <div class="base-loading__dot"></div>
        </div>
        <div v-else-if="spinnerType === 'pulse'" class="base-loading__pulse"></div>
        <div v-else class="base-loading__circle"></div>
      </div>

      <!-- Loading text -->
      <div v-if="text" class="base-loading__text">
        {{ text }}
      </div>

      <!-- Custom content slot -->
      <div v-if="$slots.default" class="base-loading__custom">
        <slot />
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import type { LoadingVariant, ComponentSize } from './index'

interface Props {
  variant?: LoadingVariant
  size?: ComponentSize
  spinnerType?: 'circle' | 'dots' | 'pulse'
  text?: string
  overlay?: boolean
  fullscreen?: boolean
}

withDefaults(defineProps<Props>(), {
  variant: 'primary',
  size: 'medium',
  spinnerType: 'circle',
  overlay: false,
  fullscreen: false,
})
</script>

<style scoped>
.base-loading {
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 20px;
}

.base-loading--overlay {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-color: rgba(255, 255, 255, 0.8);
  z-index: 1000;
}

.base-loading--fullscreen {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-color: rgba(255, 255, 255, 0.9);
  z-index: 9999;
}

.base-loading__content {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 12px;
}

/* Spinner base styles */
.base-loading__spinner {
  display: flex;
  align-items: center;
  justify-content: center;
}

/* Sizes */
.base-loading__spinner--small {
  width: 20px;
  height: 20px;
}

.base-loading__spinner--medium {
  width: 32px;
  height: 32px;
}

.base-loading__spinner--large {
  width: 48px;
  height: 48px;
}

/* Circle spinner */
.base-loading__circle {
  width: 100%;
  height: 100%;
  border: 2px solid transparent;
  border-radius: 50%;
  animation: spin 1s linear infinite;
}

.base-loading--primary .base-loading__circle {
  border-top-color: #007bff;
  border-right-color: #007bff;
}

.base-loading--light .base-loading__circle {
  border-top-color: #ffffff;
  border-right-color: #ffffff;
}

.base-loading--dark .base-loading__circle {
  border-top-color: #374151;
  border-right-color: #374151;
}

/* Dots spinner */
.base-loading__dots {
  display: flex;
  gap: 4px;
}

.base-loading__dot {
  border-radius: 50%;
  animation: pulse-dot 1.4s ease-in-out infinite both;
}

.base-loading__spinner--small .base-loading__dot {
  width: 4px;
  height: 4px;
}

.base-loading__spinner--medium .base-loading__dot {
  width: 6px;
  height: 6px;
}

.base-loading__spinner--large .base-loading__dot {
  width: 8px;
  height: 8px;
}

.base-loading--primary .base-loading__dot {
  background-color: #007bff;
}

.base-loading--light .base-loading__dot {
  background-color: #ffffff;
}

.base-loading--dark .base-loading__dot {
  background-color: #374151;
}

.base-loading__dot:nth-child(1) {
  animation-delay: -0.32s;
}

.base-loading__dot:nth-child(2) {
  animation-delay: -0.16s;
}

/* Pulse spinner */
.base-loading__pulse {
  width: 100%;
  height: 100%;
  border-radius: 50%;
  animation: pulse-scale 1s ease-in-out infinite;
}

.base-loading--primary .base-loading__pulse {
  background-color: #007bff;
}

.base-loading--light .base-loading__pulse {
  background-color: #ffffff;
}

.base-loading--dark .base-loading__pulse {
  background-color: #374151;
}

/* Loading text */
.base-loading__text {
  font-size: 14px;
  font-weight: 500;
  text-align: center;
}

.base-loading--primary .base-loading__text {
  color: #374151;
}

.base-loading--light .base-loading__text {
  color: #ffffff;
}

.base-loading--dark .base-loading__text {
  color: #374151;
}

.base-loading__custom {
  text-align: center;
}

/* Animations */
@keyframes spin {
  to {
    transform: rotate(360deg);
  }
}

@keyframes pulse-dot {
  0%,
  80%,
  100% {
    transform: scale(0);
    opacity: 0.5;
  }
  40% {
    transform: scale(1);
    opacity: 1;
  }
}

@keyframes pulse-scale {
  0%,
  100% {
    transform: scale(0);
    opacity: 1;
  }
  50% {
    transform: scale(1);
    opacity: 0.3;
  }
}

/* Responsive adjustments */
@media (max-width: 768px) {
  .base-loading {
    padding: 16px;
  }

  .base-loading__content {
    gap: 8px;
  }

  .base-loading__text {
    font-size: 13px;
  }
}
</style>
