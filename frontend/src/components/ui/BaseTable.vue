<template>
  <div class="base-table">
    <div v-if="title" class="base-table__header">
      <h3 class="base-table__title">{{ title }}</h3>
    </div>

    <div class="base-table__wrapper">
      <table class="base-table__table">
        <thead class="base-table__thead">
          <tr>
            <th
              v-for="column in columns"
              :key="column.key"
              :class="[
                'base-table__th',
                {
                  'base-table__th--sortable': column.sortable,
                  'base-table__th--sorted': sortBy === column.key,
                  'base-table__th--center': column.align === 'center',
                  'base-table__th--right': column.align === 'right',
                },
              ]"
              @click="column.sortable ? handleSort(column.key) : null"
            >
              <div class="base-table__th-content">
                {{ column.label }}
                <span v-if="column.sortable && sortBy === column.key" class="base-table__sort-icon">
                  {{ sortOrder === 'asc' ? '↑' : '↓' }}
                </span>
                <span
                  v-else-if="column.sortable"
                  class="base-table__sort-icon base-table__sort-icon--inactive"
                >
                  ↕
                </span>
              </div>
            </th>
          </tr>
        </thead>
        <tbody class="base-table__tbody">
          <tr
            v-for="(row, index) in sortedData"
            :key="getRowKey(row, index)"
            :class="[
              'base-table__tr',
              {
                'base-table__tr--striped': striped && index % 2 === 1,
                'base-table__tr--hoverable': hoverable,
              },
            ]"
          >
            <td
              v-for="column in columns"
              :key="column.key"
              :class="[
                'base-table__td',
                {
                  'base-table__td--center': column.align === 'center',
                  'base-table__td--right': column.align === 'right',
                },
              ]"
            >
              <slot
                :name="`cell-${column.key}`"
                :row="row"
                :column="column"
                :value="getNestedValue(row, column.key)"
              >
                {{ formatCellValue(getNestedValue(row, column.key), column) }}
              </slot>
            </td>
          </tr>
        </tbody>
      </table>
    </div>

    <div v-if="showFooter" class="base-table__footer">
      <slot name="footer">
        <span class="base-table__count">
          Showing {{ data.length }} {{ data.length === 1 ? 'item' : 'items' }}
        </span>
      </slot>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed, ref } from 'vue'

interface TableColumn {
  key: string
  label: string
  sortable?: boolean
  align?: 'left' | 'center' | 'right'
  formatter?: (value: any) => string
}

interface Props {
  data: Record<string, any>[]
  columns: TableColumn[]
  title?: string
  striped?: boolean
  hoverable?: boolean
  showFooter?: boolean
  rowKey?: string
}

const props = withDefaults(defineProps<Props>(), {
  striped: true,
  hoverable: true,
  showFooter: false,
  rowKey: 'id',
})

const sortBy = ref<string>('')
const sortOrder = ref<'asc' | 'desc'>('asc')

const sortedData = computed(() => {
  if (!sortBy.value) return props.data

  return [...props.data].sort((a, b) => {
    const aValue = getNestedValue(a, sortBy.value)
    const bValue = getNestedValue(b, sortBy.value)

    // Handle null/undefined values
    if (aValue == null && bValue == null) return 0
    if (aValue == null) return sortOrder.value === 'asc' ? 1 : -1
    if (bValue == null) return sortOrder.value === 'asc' ? -1 : 1

    // Handle different data types
    if (typeof aValue === 'number' && typeof bValue === 'number') {
      return sortOrder.value === 'asc' ? aValue - bValue : bValue - aValue
    }

    // String comparison
    const aStr = String(aValue).toLowerCase()
    const bStr = String(bValue).toLowerCase()

    if (sortOrder.value === 'asc') {
      return aStr.localeCompare(bStr)
    } else {
      return bStr.localeCompare(aStr)
    }
  })
})

const handleSort = (columnKey: string) => {
  if (sortBy.value === columnKey) {
    sortOrder.value = sortOrder.value === 'asc' ? 'desc' : 'asc'
  } else {
    sortBy.value = columnKey
    sortOrder.value = 'asc'
  }
}

const getNestedValue = (obj: Record<string, any>, path: string): any => {
  return path.split('.').reduce((current, key) => current?.[key], obj)
}

const getRowKey = (row: Record<string, any>, index: number): string | number => {
  return getNestedValue(row, props.rowKey) ?? index
}

const formatCellValue = (value: any, column: TableColumn): string => {
  if (column.formatter) {
    return column.formatter(value)
  }

  if (value == null) return ''

  // Format numbers with locale string
  if (typeof value === 'number') {
    return value.toLocaleString()
  }

  return String(value)
}
</script>

<style scoped>
.base-table {
  width: 100%;
}

.base-table__header {
  margin-bottom: 16px;
}

.base-table__title {
  margin: 0;
  font-size: 18px;
  font-weight: 600;
  color: #374151;
}

.base-table__wrapper {
  overflow-x: auto;
  border-radius: 8px;
  border: 1px solid #e5e7eb;
}

.base-table__table {
  width: 100%;
  border-collapse: collapse;
  background-color: #ffffff;
}

.base-table__thead {
  background-color: #f9fafb;
}

.base-table__th {
  padding: 12px;
  text-align: left;
  font-weight: 600;
  color: #374151;
  border-bottom: 1px solid #e5e7eb;
  position: relative;
}

.base-table__th--sortable {
  cursor: pointer;
  user-select: none;

  &:hover {
    background-color: #f3f4f6;
  }
}

.base-table__th--sortable .base-table__th--center {
  text-align: center;

  .base-table__th-content {
    justify-content: center;
  }
}

.base-table__th--right {
  text-align: right;

  .base-table__th-content {
    justify-content: flex-end;
  }
}

.base-table__th-content {
  display: flex;
  align-items: center;
  gap: 4px;
}

.base-table__sort-icon {
  font-size: 12px;
  color: #6b7280;
}

.base-table__sort-icon--inactive {
  opacity: 0.5;
}

.base-table__tbody {
  background-color: #ffffff;
}

.base-table__tr {
  border-bottom: 1px solid #e5e7eb;
}

.base-table__tr--striped {
  background-color: #f9fafb;
}

.base-table__tr--hoverable:hover {
  background-color: #f3f4f6;
}

.base-table__td {
  padding: 12px;
  color: #374151;
}

.base-table__td--center {
  text-align: center;
}

.base-table__td--right {
  text-align: right;
}

.base-table__footer {
  margin-top: 16px;
  padding: 8px 0;
  border-top: 1px solid #e5e7eb;
}

.base-table__count {
  font-size: 14px;
  color: #6b7280;
}

/* Responsive design */
@media (max-width: 768px) {
  .base-table__th,
  .base-table__td {
    padding: 8px;
    font-size: 14px;
  }

  .base-table__wrapper {
    border-radius: 4px;
  }
}
</style>
