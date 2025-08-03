<template>
  <div class="statistics-page">
    <!-- Header -->
    <div class="page-header">
      <h2>Company Statistics</h2>
    </div>

    <!-- Main Content -->
    <main class="main-content">
      <CompanySalaries />
    </main>
  </div>
</template>

<script setup lang="ts">
import CompanySalaries from '@/components/CompanySalaries.vue'
</script>

<style scoped>
.statistics-page {
  min-height: 100vh;
  display: flex;
  flex-direction: column;
}

.page-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 1rem 2rem;
  background-color: #f8f9fa;
  border-bottom: 1px solid #dee2e6;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
}

.page-header h1 {
  margin: 0;
  color: #333;
}

.main-content {
  flex: 1;
  padding: 2rem;
  background-color: #f8f9fa;
  min-height: calc(100vh - 80px);
}

/* Responsive design */
@media (max-width: 768px) {
  .page-header {
    padding: 1rem;
  }
}
</style>
