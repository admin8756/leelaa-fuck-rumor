import { defineStore } from 'pinia';
import { ref, computed } from 'vue';
import axios from 'axios';
import type { ApiResponse, ReportData, RumorItem, Category } from '../types';

export const useRumorStore = defineStore('rumors', () => {
  const reports = ref<ReportData[]>([]);
  const isLoading = ref(false);
  const error = ref<string | null>(null);
  const selectedCategory = ref<string | null>(null);
  const currentReportIndex = ref(0);

  // Computed properties
  const currentReport = computed(() => reports.value[currentReportIndex.value] || null);
  
  const currentReportRumors = computed(() => {
    if (!currentReport.value) return [];
    try {
      return JSON.parse(currentReport.value.content) as RumorItem[];
    } catch (e) {
      console.error('Failed to parse report content:', e);
      return [];
    }
  });

  const categories = computed(() => {
    return reports.value.map((report, index) => ({
      id: report.vid,
      name: report.name,
      index
    }));
  });

  // Functions
  async function fetchRumors() {
    isLoading.value = true;
    error.value = null;
    
    try {
      // For development, you can use this mock data URL
      // const response = await axios.get('/mock-data.json');
      
      // For production use the actual API
      const response = await axios.get<ApiResponse>('https://wx-piyao-api.4ce.cn/api');
      
      if (response.data.success) {
        reports.value = response.data.data;
        currentReportIndex.value = 0;
      } else {
        throw new Error('API request failed');
      }
    } catch (err) {
      console.error('Error fetching rumors:', err);
      error.value = 'Failed to load data. Please try again later.';
    } finally {
      isLoading.value = false;
    }
  }

  function selectCategory(categoryId: string) {
    const index = reports.value.findIndex(report => report.vid === categoryId);
    if (index !== -1) {
      currentReportIndex.value = index;
      selectedCategory.value = categoryId;
    }
  }

  return {
    reports,
    isLoading,
    error,
    selectedCategory,
    currentReportIndex,
    currentReport,
    currentReportRumors,
    categories,
    fetchRumors,
    selectCategory
  };
});