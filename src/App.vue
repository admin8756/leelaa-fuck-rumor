<template>
  <div 
    class="min-h-screen transition-colors duration-200"
    :class="{
      'bg-gray-100 text-gray-900': theme === 'light',
      'bg-gray-900 text-gray-100': theme === 'dark',
      'bg-elderly-bg text-elderly-text': theme === 'elderly'
    }"
  >
    <div class="container mx-auto px-4 py-4 sm:py-8 max-w-5xl">
      <header class="mb-4 sm:mb-8">
        <div class="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-4 mb-4 sm:mb-8">
          <h1 
            class="text-2xl sm:text-3xl font-bold text-blue-800 dark:text-blue-400 text-center sm:text-left" 
            :class="{ 'text-3xl sm:text-4xl': theme === 'elderly' }"
          >
            辟谣平台
          </h1>
          <ThemeToggle />
        </div>
        
        <CategoryList v-if="rumorsLoaded" />
      </header>

      <main>
        <div v-if="isLoading">
          <LoadingSpinner />
        </div>
        
        <ErrorMessage 
          v-else-if="error" 
          :message="error" 
          @retry="fetchRumors" 
        />
        
        <div v-else-if="currentReportRumors.length > 0">
          <div class="mb-4 sm:mb-6">
            <h2 
              class="text-xl sm:text-2xl font-bold mb-2 text-blue-700 dark:text-blue-300 text-center sm:text-left"
              :class="{ 'text-2xl sm:text-3xl mb-3 sm:mb-4': theme === 'elderly' }"
            >
              {{ currentReport?.name }}
            </h2>
            <p 
              class="text-gray-600 dark:text-gray-400 text-center sm:text-left"
              :class="{ 'text-lg sm:text-xl': theme === 'elderly' }"
            >
              更新时间: {{ formatDate(currentReport?.update_time) }}
            </p>
          </div>
          
          <div>
            <RumorCard 
              v-for="(rumor, index) in currentReportRumors" 
              :key="index" 
              :rumor="rumor" 
            />
          </div>
        </div>
        
        <div 
          v-else-if="rumorsLoaded" 
          class="text-center py-8 sm:py-16 text-gray-600 dark:text-gray-400"
        >
          <p class="text-lg sm:text-xl">暂无辟谣信息</p>
        </div>
      </main>
      
      <footer 
        class="mt-8 sm:mt-12 pt-4 sm:pt-6 border-t border-gray-300 dark:border-gray-700 text-center text-gray-600 dark:text-gray-400"
        :class="{ 'text-base sm:text-lg': theme === 'elderly' }"
      >
        <p>© 2025 辟谣平台 - 保护真相，传播正能量</p>
      </footer>
    </div>
  </div>
</template>

<script setup lang="ts">
import { onMounted, computed } from 'vue';
import dayjs from 'dayjs';
import ThemeToggle from './components/ThemeToggle.vue';
import CategoryList from './components/CategoryList.vue';
import RumorCard from './components/RumorCard.vue';
import LoadingSpinner from './components/LoadingSpinner.vue';
import ErrorMessage from './components/ErrorMessage.vue';
import { useRumorStore } from './stores/rumorStore';
import { useThemeStore } from './stores/themeStore';

const rumorStore = useRumorStore();
const themeStore = useThemeStore();

const theme = computed(() => themeStore.theme);
const isLoading = computed(() => rumorStore.isLoading);
const error = computed(() => rumorStore.error);
const currentReport = computed(() => rumorStore.currentReport);
const currentReportRumors = computed(() => rumorStore.currentReportRumors);
const rumorsLoaded = computed(() => rumorStore.reports.length > 0);

const fetchRumors = () => {
  rumorStore.fetchRumors();
};

const formatDate = (timestamp?: string) => {
  if (!timestamp) return '';
  return dayjs(parseInt(timestamp)).format('YYYY年MM月DD日 HH:mm');
};

onMounted(() => {
  fetchRumors();
});
</script>