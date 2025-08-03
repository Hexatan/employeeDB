<script setup lang="ts">
import EmployeeList from '@/components/EmployeeList.vue'
import FileUpload from '@/components/FileUpload.vue'
import {BaseButton} from '@/components/ui'
import {computed, ref} from 'vue'
import CompanySalaries from '@/components/CompanySalaries.vue'

const showUpload = ref(false)
const employeeListRef = ref<InstanceType<typeof EmployeeList>>()
const employeeListEmpty = computed(() => (!employeeListRef.value?.isLoading && !employeeListRef.value?.employees.length))

const handleUploadSuccess = () => {
  // Refresh the employee list after successful upload
  if (employeeListRef.value) {
    employeeListRef.value.refresh()
  }
}
</script>

<template>
  <div class="app-container">
    <!-- Header -->
    <header class="app-header">
      <h1>Employee DB</h1>
      <BaseButton v-show="!employeeListEmpty" @click="showUpload = !showUpload" class="sidebar-toggle">
        {{ showUpload ? 'Hide Importer' : 'Import CSV' }}
      </BaseButton>
    </header>

    <!-- Main Layout -->
    <div class="app-layout">
      <!-- Sidebar -->
      <aside class="sidebar" :class="{ 'sidebar-open': showUpload || employeeListEmpty }">
        <div class="sidebar-content">
          <FileUpload @upload-success="handleUploadSuccess"/>
        </div>
      </aside>

      <!-- Main Content -->
      <main class="main-content" :class="{ 'sidebar-open': showUpload || employeeListEmpty }">
        <EmployeeList v-show="!employeeListEmpty" ref="employeeListRef"/>
        <CompanySalaries></CompanySalaries>
      </main>
    </div>
  </div>
</template>

<style scoped>
.app-container {
  min-height: 100vh;
  display: flex;
  flex-direction: column;
}

.app-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 1rem 2rem;
  background-color: #f8f9fa;
  border-bottom: 1px solid #dee2e6;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
}

.app-header h1 {
  margin: 0;
  color: #333;
}

.sidebar-toggle {
  min-width: 120px;
}

.app-layout {
  display: flex;
  flex: 1;
  position: relative;
}

.sidebar {
  position: absolute;
  left: -350px; /* Hidden by default */
  width: 350px;
  height: calc(100vh - 80px);
  background-color: #ffffff;
  border-right: 1px solid #dee2e6;
  box-shadow: inset 2px 0 8px rgba(0, 0, 0, 0.1);
  transition: left 0.3s ease-in-out;
  z-index: 1000;
  overflow-y: auto;
}

.sidebar.sidebar-open {
  left: 0;
}

.sidebar-content {
  padding: 1.5rem;
}

.main-content {
  flex: 1;
  padding: 2rem;
  transition: margin-left 0.3s ease-in-out;
  background-color: #f8f9fa;
  min-height: calc(100vh - 80px);
}

.main-content.sidebar-open {
  margin-left: 350px;
}

/* Responsive design */
@media (max-width: 768px) {
  .app-header {
    padding: 1rem;
  }

  .sidebar {
    width: 100%;
    left: -100%;
  }

  .main-content.sidebar-open {
    margin-left: 0;
  }

  .sidebar.sidebar-open {
    left: 0;
  }
}
</style>

<style>
body {
  margin: 0;
}
</style>
