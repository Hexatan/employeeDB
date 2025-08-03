import { ref } from 'vue'
import { defineStore } from 'pinia'

export const useUIStore = defineStore('ui', () => {
  // State for controlling the CSV import sidebar visibility
  const showUpload = ref(false)

  // Actions to toggle and set the upload visibility
  function toggleUpload() {
    showUpload.value = !showUpload.value
  }

  function setUploadVisibility(visible: boolean) {
    showUpload.value = visible
  }

  function hideUpload() {
    showUpload.value = false
  }

  function showUploadPanel() {
    showUpload.value = true
  }

  return {
    showUpload,
    toggleUpload,
    setUploadVisibility,
    hideUpload,
    showUploadPanel
  }
})
