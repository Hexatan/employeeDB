<template>
  <div class="company-salaries">
    <h2>Company Salary Statistics</h2>

    <BaseLoading v-if="isLoading" text="Loading salary data..."/>

    <BaseAlert
      v-else-if="error"
      variant="danger"
      :message="error"
      dismissible
      @dismiss="error = ''"
    />

    <BaseAlert
      v-else-if="salaryData.length === 0"
      variant="info"
      message="No salary data available."
    />

    <div v-else>
      <!-- Company Breakdown -->
      <div class="company-section">
        <BaseTable
          :data="salaryData"
          :columns="tableColumns"
          title="Salary by Company"
          striped
          hoverable
        >
          <template #cell-company_name="{ value }">
            <span class="company-name">{{ value }}</span>
          </template>

          <template #cell-employee_count="{ value }">
            {{ value }}
          </template>

          <template #cell-average_salary="{ value }">
            ${{ value.toLocaleString() }}
          </template>
        </BaseTable>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import {computed, onMounted, ref} from 'vue'
import {BaseAlert, BaseLoading, BaseTable} from '@/components/ui'

interface CompanySalaryData {
  company_name: string
  average_salary: number
}

// Table columns configuration
const tableColumns = [
  {key: 'company_name', label: 'Company', sortable: true},
  {key: 'average_salary', label: 'Average Salary', sortable: true, align: 'right' as const},
]

const salaryData = ref<CompanySalaryData[]>([])
const isLoading = ref(false)
const error = ref('')

const fetchSalaryData = async () => {
  isLoading.value = true
  error.value = ''

  try {
    const apiBaseUrl = import.meta.env.VITE_API_BASE_URL || 'http://localhost:8080'
    const response = await fetch(`${apiBaseUrl}/api/salaries`)

    if (!response.ok) {
      throw new Error('Failed to fetch salary data')
    }

    const data = await response.json()
    salaryData.value = data
  } catch (err) {
    error.value = 'Failed to load salary data. Please try again.'
    console.error('Error fetching salary data:', err)
  } finally {
    isLoading.value = false
  }
}

onMounted(() => {
  fetchSalaryData()
})

// Expose the refresh method for parent components
defineExpose({
  refresh: fetchSalaryData,
})
</script>

<style scoped>
.company-salaries {
  padding: 20px;
}

.company-section {
  margin-top: 30px;
}

.company-name {
  font-weight: 600;
  color: #007bff;
}
</style>
