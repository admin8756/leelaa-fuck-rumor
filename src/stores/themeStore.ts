import { defineStore } from 'pinia';
import { ref } from 'vue';
import type { ThemeMode } from '../types';

export const useThemeStore = defineStore('theme', () => {
  const storedTheme = localStorage.getItem('theme') as ThemeMode | null;
  const theme = ref<ThemeMode>(storedTheme || 'light');
  
  function setTheme(newTheme: ThemeMode) {
    theme.value = newTheme;
    localStorage.setItem('theme', newTheme);

    // Apply theme to document
    const documentElement = document.documentElement;
    documentElement.classList.remove('light', 'dark', 'elderly-mode');

    if (newTheme === 'dark') {
      documentElement.classList.add('dark');
    } else if (newTheme === 'elderly') {
      documentElement.classList.add('elderly-mode');
    }
  }
  
  // Initialize theme on store creation
  setTheme(theme.value);
  
  return {
    theme,
    setTheme
  };
});