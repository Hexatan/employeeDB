<template>
  <div class="file-upload">
    <h2>Upload CSV File</h2>
    <form @submit.prevent="handleSubmit">
      <div class="upload-area">
        <input
          type="file"
          ref="fileInput"
          @change="handleFileSelect"
          accept=".csv"
          class="file-input"
        />
        <div v-if="selectedFile" class="file-info">
          Selected: {{ selectedFile.name }}
        </div>
      </div>
      <button type="submit" :disabled="!selectedFile || isUploading" class="upload-btn">
        {{ isUploading ? 'Uploading...' : 'Upload File' }}
      </button>
    </form>
    <BaseAlert
      v-if="showAlert"
      :variant="alertVariant"
      :message="message"
      :auto-close="alertVariant === 'success' ? 5000 : 0"
      :model-value="showAlert"
      @update:model-value="showAlert = $event"
      dismissible
    />
  </div>
</template>

<script setup lang="ts">
import {ref} from 'vue'
import BaseAlert from './ui/BaseAlert.vue'

// Define emits
const emit = defineEmits<{
  'upload-success': []
}>()

const fileInput = ref<HTMLInputElement>()
const selectedFile = ref<File | null>(null)
const isUploading = ref(false)
const message = ref('')
const alertVariant = ref<'success' | 'danger'>('success')
const showAlert = ref(false)

const handleFileSelect = (event: Event) => {
  const target = event.target as HTMLInputElement
  if (target.files && target.files.length > 0) {
    selectedFile.value = target.files[0]
    showAlert.value = false
    message.value = ''
  }
}

const handleSubmit = async () => {
  if (!selectedFile.value) return

  isUploading.value = true
  showAlert.value = false
  message.value = ''

  try {
    const formData = new FormData()
    formData.append('file', selectedFile.value)

    const apiBaseUrl = import.meta.env.VITE_API_BASE_URL || 'http://localhost:8080'
    const response = await fetch(`${apiBaseUrl}/api/upload`, {
      method: 'POST',
      body: formData,
    })

    if (response.ok) {
      message.value = 'File uploaded successfully!'
      alertVariant.value = 'success'
      showAlert.value = true
      selectedFile.value = null
      if (fileInput.value) {
        fileInput.value.value = ''
      }
      // Emit success event to parent component
      emit('upload-success')
    } else {
      throw new Error('Upload failed')
    }
  } catch (error) {
    message.value = 'Upload failed. Please try again.'
    alertVariant.value = 'danger'
    showAlert.value = true
  } finally {
    isUploading.value = false
  }
}
</script>

<style scoped>
.file-upload {
  width: 100%;
  padding: 0;
}

.file-upload h2 {
  margin: 0 0 1.5rem 0;
  color: #333;
  font-size: 1.25rem;
  font-weight: 600;
}

.upload-area {
  border: 2px dashed #dee2e6;
  border-radius: 8px;
  padding: 1.5rem;
  text-align: center;
  margin-bottom: 1.5rem;
  background-color: #f8f9fa;
  transition: border-color 0.2s ease;
}

.upload-area:hover {
  border-color: #007bff;
  background-color: #f0f8ff;
}

.file-input {
  margin-bottom: 0.75rem;
  width: 100%;
}

.file-info {
  color: #6c757d;
  font-size: 0.875rem;
  margin-top: 0.5rem;
  word-break: break-all;
}

.upload-btn {
  background-color: #007bff;
  color: white;
  border: none;
  padding: 0.75rem 1.5rem;
  border-radius: 6px;
  cursor: pointer;
  font-size: 0.875rem;
  font-weight: 500;
  width: 100%;
  transition: background-color 0.2s ease;
}

.upload-btn:hover:not(:disabled) {
  background-color: #0056b3;
}

.upload-btn:disabled {
  background-color: #6c757d;
  cursor: not-allowed;
  opacity: 0.6;
}


/* Responsive adjustments for very narrow sidebars */
@media (max-width: 400px) {
  .upload-area {
    padding: 1rem;
  }

  .upload-btn {
    padding: 0.625rem 1rem;
    font-size: 0.8125rem;
  }
}
</style>
