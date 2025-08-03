<script setup lang="ts">
import {useRoute, useRouter} from 'vue-router'
import {BaseButton} from '@/components/ui'

const router = useRouter()
const route = useRoute()

const navigateToEmployees = () => {
  router.push('/employees')
}

const navigateToStatistics = () => {
  router.push('/statistics')
}
</script>

<template>
  <div class="app-container">
    <!-- Header with Navigation -->
    <header class="app-header">
      <h1>Employee DB</h1>
      <nav class="app-navigation">
        <BaseButton
          @click="navigateToEmployees"
          :class="{ 'active': route.path === '/employees' }"
          variant="outline"
        >
          Employees
        </BaseButton>
        <BaseButton
          @click="navigateToStatistics"
          :class="{ 'active': route.path === '/statistics' }"
          variant="outline"
        >
          Statistics
        </BaseButton>
      </nav>
    </header>

    <!-- Router View -->
    <router-view/>
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

.app-navigation {
  display: flex;
  gap: 1rem;
}

.app-navigation button {
  transition: all 0.2s ease;
}

.app-navigation button.active {
  background-color: #007bff;
  color: white;
  border-color: #007bff;
}

.app-navigation button:hover {
  background-color: #0056b3;
  color: white;
  border-color: #0056b3;
}

/* Responsive design */
@media (max-width: 768px) {
  .app-header {
    padding: 1rem;
    flex-direction: column;
    gap: 1rem;
  }

  .app-navigation {
    width: 100%;
    justify-content: center;
  }
}
</style>

<style>
body {
  margin: 0;
}
</style>
