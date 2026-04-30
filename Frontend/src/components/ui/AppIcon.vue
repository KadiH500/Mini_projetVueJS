<template>
  <svg
    :width="size"
    :height="size"
    viewBox="0 0 24 24"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    :class="['app-icon', nameClass]"
  >
    <!-- Classic Book / Catalog -->
    <template v-if="name === 'book'">
      <path d="M4 19.5V4.5C4 3.67157 4.67157 3 5.5 3H18.5C19.3284 3 20 3.67157 20 4.5V19.5" :stroke-width="strokeWidth" stroke="currentColor" stroke-linecap="round" />
      <path d="M4 17.5C4 16.6716 4.67157 16 5.5 16H20" :stroke-width="strokeWidth" stroke="currentColor" stroke-linecap="round" />
      <path d="M7 3V16" :stroke-width="strokeWidth" stroke="currentColor" />
      <path d="M11 7H16" :stroke-width="strokeWidth" stroke="currentColor" stroke-linecap="round" />
      <path d="M11 11H16" :stroke-width="strokeWidth" stroke="currentColor" stroke-linecap="round" />
    </template>

    <!-- Users / Community -->
    <template v-else-if="name === 'users'">
      <path d="M17 21V19C17 17.9391 16.5786 16.9217 15.8284 16.1716C15.0783 15.4214 14.0609 15 13 15H5C3.93913 15 2.92172 15.4214 2.17157 16.1716C1.42143 16.9217 1 17.9391 1 19V21" :stroke-width="strokeWidth" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" />
      <circle cx="9" cy="7" r="4" :stroke-width="strokeWidth" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" />
      <path d="M23 21V19C22.9993 18.1137 22.7044 17.2528 22.1614 16.5523C21.6184 15.8519 20.8581 15.3516 20 15.13" :stroke-width="strokeWidth" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" />
      <path d="M16 3.13C16.8604 3.35031 17.623 3.85071 18.1676 4.55232C18.7122 5.25393 19.0078 6.11683 19.0078 7.005C19.0078 7.89317 18.7122 8.75607 18.1676 9.45768C17.623 10.1593 16.8604 10.6597 16 10.88" :stroke-width="strokeWidth" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" />
    </template>

    <!-- Stats / Analytics -->
    <template v-else-if="name === 'stats'">
      <path d="M18 20V10" :stroke-width="strokeWidth" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" />
      <path d="M12 20V4" :stroke-width="strokeWidth" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" />
      <path d="M6 20V14" :stroke-width="strokeWidth" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" />
      <path d="M2 20H22" :stroke-width="strokeWidth" stroke="currentColor" stroke-linecap="round" />
    </template>

    <!-- Home / Dashboard -->
    <template v-else-if="name === 'home'">
      <path d="M3 9.5L12 3L21 9.5V19C21 20.1046 20.1046 21 19 21H5C3.89543 21 3 20.1046 3 19V9.5Z" :stroke-width="strokeWidth" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" />
      <path d="M9 21V12H15V21" :stroke-width="strokeWidth" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" />
    </template>

    <!-- Heart / Wishlist -->
    <template v-else-if="name === 'heart'">
      <path
        d="M20.84 4.61C20.3292 4.099 19.7228 3.69364 19.0554 3.41708C18.3879 3.14052 17.6725 2.99817 16.95 2.99817C16.2275 2.99817 15.5121 3.14052 14.8446 3.41708C14.1772 3.69364 13.5708 4.099 13.06 4.61L12 5.67L10.94 4.61C9.9083 3.5783 8.50903 2.9987 7.05 2.9987C5.59096 2.9987 4.1917 3.5783 3.16 4.61C2.1283 5.6417 1.54871 7.04096 1.54871 8.5C1.54871 9.95904 2.1283 11.3583 3.16 12.39L12 21.23L20.84 12.39C21.351 11.8792 21.7564 11.2728 22.0329 10.6054C22.3095 9.93796 22.4518 9.22248 22.4518 8.5C22.4518 7.77752 22.3095 7.06204 22.0329 6.39464C21.7564 5.72723 21.351 5.12077 20.84 4.61Z"
        :fill="filled ? 'currentColor' : 'none'"
        :stroke-width="strokeWidth"
        stroke="currentColor"
        stroke-linecap="round"
        stroke-linejoin="round"
      />
    </template>

    <!-- Cart / Shopping -->
    <template v-else-if="name === 'cart'">
      <path d="M1 1H5L7.68 14.39C7.77144 14.8504 8.02191 15.264 8.38755 15.5583C8.75318 15.8526 9.2107 16.009 9.68 16H19.4C19.8693 16.009 20.3268 15.8526 20.6924 15.5583C21.0581 15.264 21.3086 14.8504 21.4 14.39L23 6H6" :stroke-width="strokeWidth" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" />
      <circle cx="9" cy="21" r="1" :stroke-width="strokeWidth" stroke="currentColor" />
      <circle cx="20" cy="21" r="1" :stroke-width="strokeWidth" stroke="currentColor" />
    </template>

    <!-- Search / Lens -->
    <template v-else-if="name === 'search'">
      <circle cx="11" cy="11" r="8" :stroke-width="strokeWidth" stroke="currentColor" />
      <path d="M21 21L16.65 16.65" :stroke-width="strokeWidth" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" />
    </template>

    <!-- Settings / Gear -->
    <template v-else-if="name === 'settings'">
      <circle cx="12" cy="12" r="3" :stroke-width="strokeWidth" stroke="currentColor" />
      <path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1 0 2.83 2 2 0 0 1-2.83 0l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-2 2 2 2 0 0 1-2-2v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83 0 2 2 0 0 1 0-2.83l.06-.06a1.65 1.65 0 0 0 .33-1.82 1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1-2-2 2 2 0 0 1 2-2h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 0-2.83 2 2 0 0 1 2.83 0l.06.06a1.65 1.65 0 0 0 1.82.33H9a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 2-2 2 2 0 0 1 2 2v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 0 2 2 0 0 1 0 2.83l-.06.06a1.65 1.65 0 0 0-.33 1.82V9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 2 2 2 2 0 0 1-2 2h-.09a1.65 1.65 0 0 0-1.51 1Z" :stroke-width="strokeWidth" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" />
    </template>

    <!-- Logout / Door -->
    <template v-else-if="name === 'logout'">
      <path d="M9 21H5C4.46957 21 3.96086 20.7893 3.58579 20.4142C3.21071 20.0391 3 19.5304 3 19V5C3 4.46957 3.21071 3.96086 3.58579 3.58579C3.96086 3.21071 4.46957 3 5 3H9" :stroke-width="strokeWidth" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" />
      <path d="M16 17L21 12L16 7" :stroke-width="strokeWidth" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" />
      <path d="M21 12H9" :stroke-width="strokeWidth" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" />
    </template>

    <!-- Trash / Delete -->
    <template v-else-if="name === 'trash'">
      <path d="M3 6H5H21" :stroke-width="strokeWidth" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" />
      <path d="M8 6V4C8 3.46957 8.21071 2.96086 8.58579 2.58579C8.96086 2.21071 9.46957 2 10 2H14C14.5304 2 15.0391 2.21071 15.4142 2.58579C15.7893 2.96086 16 3.46957 16 4V6M19 6V20C19 20.5304 18.7893 21.0391 18.4142 21.4142C18.0391 21.7893 17.5304 22 17 22H7C6.46957 22 5.96086 21.7893 5.58579 21.4142C5.21071 21.0391 5 20.5304 5 20V6H19Z" :stroke-width="strokeWidth" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" />
    </template>

    <!-- Edit / Quill -->
    <template v-else-if="name === 'edit'">
      <path d="M11 4H4C3.46957 4 2.96086 4.21071 2.58579 4.58579C2.21071 4.96086 2 5.46957 2 6V20C2 20.5304 2.21071 21.0391 2.58579 21.4142C2.96086 21.7893 3.46957 22 4 22H18C18.5304 22 19.0391 21.7893 19.4142 21.4142C19.7893 21.0391 20 20.5304 20 20V13" :stroke-width="strokeWidth" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" />
      <path d="M18.5 2.5C18.8978 2.10217 19.4374 1.87868 20 1.87868C20.5626 1.87868 21.1022 2.10217 21.5 2.5C21.8978 2.89782 22.1213 3.43739 22.1213 4C22.1213 4.56261 21.8978 5.10217 21.5 5.5L12 15L8 16L9 12L18.5 2.5Z" :stroke-width="strokeWidth" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" />
    </template>

    <!-- Package / Delivery -->
    <template v-else-if="name === 'package'">
      <path d="M12 2L3 7V17L12 22L21 17V7L12 2Z" :stroke-width="strokeWidth" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" />
      <path d="M3 7L12 12L21 7" :stroke-width="strokeWidth" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" />
      <path d="M12 22V12" :stroke-width="strokeWidth" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" />
      <path d="M16 14.3L20 12.1" :stroke-width="strokeWidth" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" />
    </template>

    <!-- Search Book -->
    <template v-else-if="name === 'search-book'">
      <path d="M4 19.5V4.5C4 3.67157 4.67157 3 5.5 3H18.5C19.3284 3 20 3.67157 20 4.5V14" :stroke-width="strokeWidth" stroke="currentColor" stroke-linecap="round" />
      <path d="M4 17.5C4 16.6716 4.67157 16 5.5 16H12" :stroke-width="strokeWidth" stroke="currentColor" stroke-linecap="round" />
      <circle cx="17" cy="17" r="4" :stroke-width="strokeWidth" stroke="currentColor" />
      <path d="M20 20L22 22" :stroke-width="strokeWidth" stroke="currentColor" stroke-linecap="round" />
    </template>

    <!-- Sparkles / Magic -->
    <template v-else-if="name === 'sparkles'">
      <path d="M12 3L14.5 9L21 12L14.5 15L12 21L9.5 15L3 12L9.5 9L12 3Z" :stroke-width="strokeWidth" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" />
      <path d="M5 5L6 6" :stroke-width="strokeWidth" stroke="currentColor" stroke-linecap="round" />
      <path d="M18 18L19 19" :stroke-width="strokeWidth" stroke="currentColor" stroke-linecap="round" />
    </template>

    <!-- Info / Details -->
    <template v-else-if="name === 'info'">
      <circle cx="12" cy="12" r="10" :stroke-width="strokeWidth" stroke="currentColor" />
      <line x1="12" y1="16" x2="12" y2="12" :stroke-width="strokeWidth" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" />
      <line x1="12" y1="8" x2="12.01" y2="8" :stroke-width="strokeWidth" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" />
    </template>

    <!-- Inbox / Empty -->
    <template v-else-if="name === 'inbox'">
      <polyline points="22 12 16 12 14 15 10 15 8 12 2 12" :stroke-width="strokeWidth" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" />
      <path d="M5.45 5.11L2 12v6a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2v-6l-3.45-6.89A2 2 0 0 0 16.76 4H7.24a2 2 0 0 0-1.79 1.11z" :stroke-width="strokeWidth" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" />
    </template>

    <!-- User / Profile -->
    <template v-else-if="name === 'user'">
      <path d="M20 21V19C20 17.9391 19.5786 16.9217 18.8284 16.1716C18.0783 15.4214 17.0609 15 16 15H8C6.93913 15 5.92172 15.4214 5.17157 16.1716C4.42143 16.9217 4 17.9391 4 19V21" :stroke-width="strokeWidth" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" />
      <circle cx="12" cy="7" r="4" :stroke-width="strokeWidth" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" />
    </template>

    <!-- Mail / Email -->
    <template v-else-if="name === 'mail'">
      <path d="M4 4H20C21.1 4 22 4.9 22 6V18C22 19.1 21.1 20 20 20H4C2.9 20 2 19.1 2 18V6C2 4.9 2.9 4H4Z" :stroke-width="strokeWidth" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" />
      <path d="M22 6L12 13L2 6" :stroke-width="strokeWidth" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" />
    </template>

    <!-- Lock / Password -->
    <template v-else-if="name === 'lock'">
      <rect x="3" y="11" width="18" height="11" rx="2" ry="2" :stroke-width="strokeWidth" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" />
      <path d="M7 11V7a5 5 0 0 1 10 0v4" :stroke-width="strokeWidth" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" />
    </template>

    <!-- Alert / Warning -->
    <template v-else-if="name === 'alert'">
      <path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z" :stroke-width="strokeWidth" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" />
      <line x1="12" y1="9" x2="12" y2="13" :stroke-width="strokeWidth" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" />
      <line x1="12" y1="17" x2="12.01" y2="17" :stroke-width="strokeWidth" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" />
    </template>

    <!-- Check / Success -->
    <template v-else-if="name === 'check'">
      <polyline points="20 6 9 17 4 12" :stroke-width="strokeWidth" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" />
    </template>

    <!-- Plus / Add -->
    <template v-else-if="name === 'plus'">
      <line x1="12" y1="5" x2="12" y2="19" :stroke-width="strokeWidth" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" />
      <line x1="5" y1="12" x2="19" y2="12" :stroke-width="strokeWidth" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" />
    </template>

    <!-- Minus / Remove -->
    <template v-else-if="name === 'minus'">
      <line x1="5" y1="12" x2="19" y2="12" :stroke-width="strokeWidth" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" />
    </template>

    <!-- Chevron Down -->
    <template v-else-if="name === 'chevron-down'">
      <polyline points="6 9 12 15 18 9" :stroke-width="strokeWidth" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" />
    </template>

    <!-- Close / X -->
    <template v-else-if="name === 'close'">
      <line x1="18" y1="6" x2="6" y2="18" :stroke-width="strokeWidth" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" />
      <line x1="6" y1="6" x2="18" y2="18" :stroke-width="strokeWidth" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" />
    </template>

    <!-- Eye / Visibility -->
    <template v-else-if="name === 'eye'">
      <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" :stroke-width="strokeWidth" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" />
      <circle cx="12" cy="12" r="3" :stroke-width="strokeWidth" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" />
    </template>

    <!-- Eye Off / Hidden -->
    <template v-else-if="name === 'eye-off'">
      <path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19m-6.72-1.07a3 3 0 1 1-4.24-4.24" :stroke-width="strokeWidth" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" />
      <line x1="1" y1="1" x2="23" y2="23" :stroke-width="strokeWidth" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" />
    </template>

    <!-- Star / Rating -->
    <template v-else-if="name === 'star'">
      <path
        d="M12 2L15.09 8.26L22 9.27L17 14.14L18.18 21.02L12 17.77L5.82 21.02L7 14.14L2 9.27L8.91 8.26L12 2Z"
        :fill="filled ? 'currentColor' : 'none'"
        :stroke-width="strokeWidth"
        stroke="currentColor"
        stroke-linecap="round"
        stroke-linejoin="round"
      />
    </template>

    <!-- Default / Fallback -->
    <template v-else>
      <circle cx="12" cy="12" r="10" :stroke-width="strokeWidth" stroke="currentColor" />
      <path d="M12 8V12L14 14" :stroke-width="strokeWidth" stroke="currentColor" stroke-linecap="round" />
    </template>
  </svg>
</template>

<script setup>
import { computed } from 'vue'

const props = defineProps({
  name: { type: String, required: true },
  size: { type: [Number, String], default: 18 },
  strokeWidth: { type: [Number, String], default: 1.5 },
  filled: { type: Boolean, default: false },
})

const nameClass = computed(() => `icon-${props.name}`)
</script>

<style scoped>
.app-icon {
  display: inline-block;
  vertical-align: middle;
  flex-shrink: 0;
  transition: transform 0.2s cubic-bezier(0.4, 0, 0.2, 1);
}
</style>
