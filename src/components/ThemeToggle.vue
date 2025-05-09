<template>
  <div class="flex flex-wrap justify-center sm:justify-end gap-2 p-2 sm:p-3 bg-white dark:bg-gray-800 rounded-lg shadow-md">
    <button 
      @click="setTheme('light')" 
      class="btn p-1.5 sm:p-2 flex items-center justify-center text-sm sm:text-base" 
      :class="{ 'bg-blue-100 dark:bg-blue-800': theme === 'light' }"
      aria-label="日间模式"
    >
      <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4 sm:h-5 sm:w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z" />
      </svg>
      <span class="ml-1 sm:ml-2">日间模式</span>
    </button>
    
    <button 
      @click="setTheme('dark')" 
      class="btn p-1.5 sm:p-2 flex items-center justify-center text-sm sm:text-base" 
      :class="{ 'bg-blue-100 dark:bg-blue-800': theme === 'dark' }"
      aria-label="夜间模式"
    >
      <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4 sm:h-5 sm:w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z" />
      </svg>
      <span class="ml-1 sm:ml-2">夜间模式</span>
    </button>
    
    <button 
      @click="setTheme('elderly')" 
      class="btn p-1.5 sm:p-2 flex items-center justify-center text-sm sm:text-base" 
      :class="{ 'bg-blue-100 dark:bg-blue-800': theme === 'elderly' }"
      aria-label="老年模式"
    >
      <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4 sm:h-5 sm:w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
      </svg>
      <span class="ml-1 sm:ml-2">老年模式</span>
    </button>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue';
import { useThemeStore } from '../stores/themeStore';

const themeStore = useThemeStore();
const theme = computed(() => themeStore.theme);
const setTheme = themeStore.setTheme;
</script>