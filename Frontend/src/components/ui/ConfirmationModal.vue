<template>
  <Transition name="fade">
    <div v-if="show" class="modal-overlay" @click.self="$emit('cancel')">
      <div class="modal-card">
        <div class="modal-icon" :class="type">
          <AppIcon :name="type === 'danger' ? 'alert' : 'info'" :size="32" />
        </div>
        <h3 class="modal-title">{{ title }}</h3>
        <p class="modal-message">{{ message }}</p>
        <div class="modal-actions">
          <button class="btn-ghost" @click="$emit('cancel')">Cancel</button>
          <button 
            class="btn-confirm" 
            :class="type" 
            @click="$emit('confirm')"
            :disabled="loading"
          >
            {{ loading ? 'Processing...' : confirmText }}
          </button>
        </div>
      </div>
    </div>
  </Transition>
</template>

<script setup>
import AppIcon from './AppIcon.vue'

defineProps({
  show: Boolean,
  title: String,
  message: String,
  confirmText: { type: String, default: 'Confirm' },
  type: { type: String, default: 'danger' }, // 'danger' or 'info'
  loading: Boolean
})

defineEmits(['confirm', 'cancel'])
</script>

<style scoped>
.modal-overlay {
  position: fixed;
  inset: 0;
  background: rgba(26, 18, 8, 0.6);
  backdrop-filter: blur(4px);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 2000;
}

.modal-card {
  background: #fff;
  border-radius: 20px;
  width: 90%;
  max-width: 400px;
  padding: 32px;
  text-align: center;
  box-shadow: 0 20px 40px rgba(0,0,0,0.2);
}

.modal-icon {
  width: 64px;
  height: 64px;
  border-radius: 50%;
  margin: 0 auto 20px;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 32px;
}

.modal-icon.danger { background: #fef2f2; }
.modal-icon.info { background: #eff6ff; }

.modal-title {
  font-size: 20px;
  font-weight: 700;
  color: #1a1208;
  margin: 0 0 12px;
  font-family: 'Georgia', serif;
}

.modal-message {
  font-size: 14px;
  color: #8c7b6a;
  line-height: 1.6;
  margin: 0 0 28px;
  font-family: sans-serif;
}

.modal-actions {
  display: flex;
  gap: 12px;
}

.modal-actions button {
  flex: 1;
  padding: 12px;
  border-radius: 12px;
  font-size: 14px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.2s;
  border: none;
  font-family: sans-serif;
}

.btn-ghost {
  background: #f7efe3;
  color: #8c7b6a;
}

.btn-ghost:hover {
  background: #e8ddc8;
  color: #1a1208;
}

.btn-confirm.danger {
  background: #b94030;
  color: #fff;
}

.btn-confirm.danger:hover {
  background: #a33326;
  transform: translateY(-1px);
}

.btn-confirm.info {
  background: #c2a87a;
  color: #1a1208;
}

.btn-confirm.info:hover {
  background: #d4bc92;
  transform: translateY(-1px);
}

button:disabled {
  opacity: 0.6;
  cursor: not-allowed;
  transform: none !important;
}

/* Transitions */
.fade-enter-active, .fade-leave-active {
  transition: opacity 0.3s ease;
}

.fade-enter-from, .fade-leave-to {
  opacity: 0;
}

.fade-enter-active .modal-card {
  animation: zoomIn 0.3s ease;
}

@keyframes zoomIn {
  from { transform: scale(0.9); opacity: 0; }
  to { transform: scale(1); opacity: 1; }
}
</style>
