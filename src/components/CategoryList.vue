<template>
  <div class="w-full overflow-x-auto mb-4 sm:mb-6 pb-1 hide-scrollbar">
    <div class="flex flex-nowrap gap-2 sm:gap-4 pb-2 min-w-max">
      <button
        v-for="category in categories"
        :key="category.id"
        @click="selectCategory(category.id)"
        class="px-3 sm:px-4 py-1.5 sm:py-2 rounded-full whitespace-nowrap transition-colors duration-200 text-sm sm:text-base flex-shrink-0"
        :class="[
          selectedCategory === category.id 
            ? 'bg-blue-600 text-white' 
            : 'bg-gray-200 dark:bg-gray-700 text-gray-800 dark:text-gray-200 hover:bg-gray-300 dark:hover:bg-gray-600',
          theme === 'elderly' ? 'text-lg sm:text-xl py-2 px-4 sm:py-5' : ''
        ]"
      >
        <template v-if="parseYearMonth(category.name)">
          <span class="block text-xs text-gray-500 leading-none font-mono tracking-widest" style="letter-spacing:0.1em;">
            {{ parseYearMonth(category.name).year }}
          </span>
          <span class="block text-lg font-bold text-blue-700 dark:text-blue-300 leading-none">
            {{ parseYearMonth(category.name).month }} 
          </span>
        </template>
        <template v-else>
          {{ category.name }}月
        </template>
      </button>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue';
import { useRumorStore } from '../stores/rumorStore';
import { useThemeStore } from '../stores/themeStore';

const rumorStore = useRumorStore();
const themeStore = useThemeStore();

const categories = computed(() => rumorStore.categories);
const selectedCategory = computed(() => rumorStore.selectedCategory);
const theme = computed(() => themeStore.theme);

const selectCategory = (categoryId: string) => {
  rumorStore.selectCategory(categoryId);
};

function parseYearMonth(name: string): { year: string, month: string } | null {
  const match = name.match(/(20\\d{2})[年/-]?(0?[1-9]|1[0-2])月?/);
  if (match) {
    return {
      year: match[1],
      month: match[2].padStart(2, '0')
    };
  }
  return null;
}
</script>

<style scoped>
/* 隐藏滚动条但保留滚动功能 */
.hide-scrollbar {
  -ms-overflow-style: none;  /* IE and Edge */
  scrollbar-width: none;  /* Firefox */
}

.hide-scrollbar::-webkit-scrollbar {
  display: none;  /* Chrome, Safari, Opera */
}
</style>