<template>
  <div class="employee-list">
    <h2>Employee List</h2>

    <BaseLoading v-if="isLoading" text="Loading employees..." />

    <BaseAlert
      v-else-if="error"
      variant="danger"
      :message="error"
      dismissible
      @dismiss="error = ''"
    />

    <BaseAlert
      v-else-if="employees.length === 0"
      variant="info"
      message="No employees found."
    />

    <BaseTable
      v-else
      :data="employees"
      :columns="tableColumns"
      striped
      hoverable
    >
      <template #cell-email="{ row, value }">
        <span v-if="editingEmployeeId !== row.id">
          {{ value }}
        </span>
        <BaseInput
          v-else
          v-model="editingEmail"
          type="email"
          placeholder="Enter email"
          @enter="saveEmail(row.id)"
          @escape="cancelEdit"
        />
      </template>

      <template #cell-salary="{ value }">
        ${{ value?.toLocaleString() || 'N/A' }}
      </template>

      <template #cell-actions="{ row }">
        <BaseButton
          v-if="editingEmployeeId !== row.id"
          variant="primary"
          size="small"
          @click="startEdit(row.id, row.email)"
        >
          Edit
        </BaseButton>
        <div v-else class="edit-actions">
          <BaseButton
            variant="success"
            size="small"
            @click="saveEmail(row.id)"
          >
            Save
          </BaseButton>
          <BaseButton
            variant="secondary"
            size="small"
            @click="cancelEdit"
          >
            Cancel
          </BaseButton>
        </div>
      </template>
    </BaseTable>
  </div>
</template>

<script setup lang="ts">
import {onMounted, ref} from 'vue'
import {BaseAlert, BaseButton, BaseInput, BaseLoading, BaseTable} from '@/components/ui'

interface Employee {
  id: number
  company_id: number
  name: string
  email: string
  company_name: string
  salary?: number
}

// Table columns configuration
const tableColumns = [
  { key: 'id', label: 'ID', sortable: true },
  { key: 'name', label: 'Name', sortable: true },
  { key: 'email', label: 'Email', sortable: true },
  { key: 'company_name', label: 'Company', sortable: true },
  { key: 'salary', label: 'Salary', sortable: true, align: 'right' as const },
  { key: 'actions', label: 'Actions', align: 'center' as const }
]

const employees = ref<Employee[]>([])
const isLoading = ref(false)
const error = ref('')
const editingEmployeeId = ref<number | null>(null)
const editingEmail = ref('')

const fetchEmployees = async () => {
  isLoading.value = true
  error.value = ''

  try {
    const apiBaseUrl = import.meta.env.VITE_API_BASE_URL || 'http://localhost:8080'
    const response = await fetch(`${apiBaseUrl}/api/employees`)

    if (!response.ok) {
      throw new Error('Failed to fetch employees')
    }

    employees.value = await response.json()
  } catch (err) {
    error.value = 'Failed to load employees. Please try again.'
    console.error('Error fetching employees:', err)
  } finally {
    isLoading.value = false
  }
}

const startEdit = (employeeId: number, currentEmail: string) => {
  editingEmployeeId.value = employeeId
  editingEmail.value = currentEmail
}

const cancelEdit = () => {
  editingEmployeeId.value = null
  editingEmail.value = ''
}

const saveEmail = async (employeeId: number) => {
  if (!editingEmail.value.trim()) {
    alert('Email cannot be empty')
    return
  }

  try {
    const apiBaseUrl = import.meta.env.VITE_API_BASE_URL || 'http://localhost:8080'
    const response = await fetch(`${apiBaseUrl}/api/update-employee.php`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        id: employeeId,
        email: editingEmail.value
      })
    })

    if (!response.ok) {
      throw new Error('Failed to update employee')
    }

    // Update local data
    const employeeIndex = employees.value.findIndex(emp => emp.id === employeeId)
    if (employeeIndex !== -1) {
      employees.value[employeeIndex].email = editingEmail.value
    }

    cancelEdit()
  } catch (err) {
    error.value = 'Failed to update employee email. Please try again.'
    console.error('Error updating employee:', err)
  }
}

onMounted(() => {
  fetchEmployees()
})

// Expose refresh method for parent components
defineExpose({
  refresh: fetchEmployees
})
</script>

<style scoped>
.employee-list {
  padding: 20px;
}

.edit-actions {
  display: flex;
  gap: 8px;
  align-items: center;
}
</style>
