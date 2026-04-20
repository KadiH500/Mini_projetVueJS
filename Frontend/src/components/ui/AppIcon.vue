<template>
  <svg
    :width="size"
    :height="size"
    viewBox="0 0 24 24"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    :class="['app-icon', nameClass]"
  >
    <template v-if="name === 'book'">
      <path d="M4 6.5C4 5.11929 5.11929 4 6.5 4H20V20H6.5C5.11929 20 4 18.8807 4 17.5V6.5Z" :stroke-width="strokeWidth" stroke="currentColor" />
      <path d="M8 4V20" :stroke-width="strokeWidth" stroke="currentColor" />
      <path d="M4 17H20" :stroke-width="strokeWidth" stroke="currentColor" />
    </template>
    <template v-else-if="name === 'heart'">
      <path
        d="M12 20.5C12 20.5 4 15.36 4 9.5C4 7.01472 6.01472 5 8.5 5C10.0413 5 11.4018 5.77474 12.2 6.95864C12.9982 5.77474 14.3587 5 15.9 5C18.3853 5 20.4 7.01472 20.4 9.5C20.4 15.36 12.4 20.5 12.4 20.5H12Z"
        :fill="filled ? 'currentColor' : 'none'"
        :stroke-width="strokeWidth"
        stroke="currentColor"
      />
    </template>
    <template v-else-if="name === 'cart'">
      <path d="M3.5 5H6L8.5 15H18.3L20.5 8H7.4" :stroke-width="strokeWidth" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" />
      <circle cx="9.5" cy="19" r="1.4" :stroke-width="strokeWidth" stroke="currentColor" />
      <circle cx="17.2" cy="19" r="1.4" :stroke-width="strokeWidth" stroke="currentColor" />
    </template>
    <template v-else-if="name === 'search'">
      <circle cx="11" cy="11" r="6.5" :stroke-width="strokeWidth" stroke="currentColor" />
      <path d="M16 16L20 20" :stroke-width="strokeWidth" stroke="currentColor" stroke-linecap="round" />
    </template>
    <template v-else-if="name === 'close'">
      <path d="M6 6L18 18" :stroke-width="strokeWidth" stroke="currentColor" stroke-linecap="round" />
      <path d="M18 6L6 18" :stroke-width="strokeWidth" stroke="currentColor" stroke-linecap="round" />
    </template>
    <template v-else-if="name === 'alert'">
      <path d="M12 3.8L21 19H3L12 3.8Z" :stroke-width="strokeWidth" stroke="currentColor" stroke-linejoin="round" />
      <path d="M12 9V13.5" :stroke-width="strokeWidth" stroke="currentColor" stroke-linecap="round" />
      <circle cx="12" cy="16.5" r="0.8" fill="currentColor" />
    </template>
    <template v-else-if="name === 'inbox'">
      <path d="M4 6H20V18H4V6Z" :stroke-width="strokeWidth" stroke="currentColor" />
      <path d="M4 14H9L10.5 16H13.5L15 14H20" :stroke-width="strokeWidth" stroke="currentColor" stroke-linejoin="round" />
    </template>
    <template v-else-if="name === 'plus'">
      <path d="M12 6V18" :stroke-width="strokeWidth" stroke="currentColor" stroke-linecap="round" />
      <path d="M6 12H18" :stroke-width="strokeWidth" stroke="currentColor" stroke-linecap="round" />
    </template>
    <template v-else-if="name === 'check'">
      <path d="M5.5 12.5L10 17L18.5 8.5" :stroke-width="strokeWidth" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" />
    </template>
    <template v-else-if="name === 'star'">
      <path
        d="M12 3.8L14.57 9.02L20.34 9.86L16.17 13.93L17.15 19.68L12 16.98L6.85 19.68L7.83 13.93L3.66 9.86L9.43 9.02L12 3.8Z"
        :fill="filled ? 'currentColor' : 'none'"
        :stroke-width="strokeWidth"
        stroke="currentColor"
        stroke-linejoin="round"
      />
    </template>
    <template v-else-if="name === 'chevron-down'">
      <path
        d="M6.5 9.5L12 15L17.5 9.5"
        :stroke-width="strokeWidth"
        stroke="currentColor"
        stroke-linecap="round"
        stroke-linejoin="round"
      />
    </template>
  </svg>
</template>

<script setup>
import { computed } from 'vue'

const props = defineProps({
  name: { type: String, required: true },
  size: { type: [Number, String], default: 18 },
  strokeWidth: { type: [Number, String], default: 1.8 },
  filled: { type: Boolean, default: false },
})

const nameClass = computed(() => `icon-${props.name}`)
</script>

<style scoped>
.app-icon {
  display: inline-block;
  vertical-align: middle;
  flex-shrink: 0;
}
</style>
