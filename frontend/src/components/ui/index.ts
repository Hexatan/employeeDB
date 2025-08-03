// Export all UI components for easy importing
export { default as BaseAlert } from './BaseAlert.vue'
export { default as BaseButton } from './BaseButton.vue'
export { default as BaseCard } from './BaseCard.vue'
export { default as BaseInput } from './BaseInput.vue'
export { default as BaseLoading } from './BaseLoading.vue'
export { default as BaseTable } from './BaseTable.vue'

// Type exports for better TypeScript support
export type { default as TableColumn } from './BaseTable.vue'

// Common semantic variant types
export type SemanticVariant = 'success' | 'warning' | 'danger' | 'info'

// Component-specific variant types
export type ButtonVariant = 'primary' | 'secondary' | SemanticVariant | 'outline'
export type AlertVariant = 'default' | SemanticVariant
export type CardVariant = 'default' | 'primary' | SemanticVariant
export type LoadingVariant = 'light' | 'dark' | 'primary'

// Size types (used by multiple components)
export type ComponentSize = 'small' | 'medium' | 'large'

// Spinner types (used by BaseLoading)
export type SpinnerType = 'circle' | 'dots' | 'pulse'
