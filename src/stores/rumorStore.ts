import { defineStore } from 'pinia';
import { ref, computed } from 'vue';
import axios from 'axios';
import type { ApiResponse, ReportData, RumorItem } from '../types';

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
    // 提取所有分类名的公共前缀
    const names = reports.value.map(r => r.name);
    let prefix = names[0] || '';
    for (let i = 1; i < names.length; i++) {
      let j = 0;
      while (j < prefix.length && j < names[i].length && prefix[j] === names[i][j]) j++;
      prefix = prefix.slice(0, j);
    }
    // 去除公共前缀后返回精简标题
    return reports.value.map((report, index) => ({
      id: report.vid,
      name: report.name.startsWith(prefix) ? report.name.slice(prefix.length) : report.name,
      index
    }));
  });

  // Functions
  async function fetchRumors() {
    isLoading.value = true;
    error.value = null;
    try {
      const response = await axios.get<ApiResponse>('https://wx-piyao-api.4ce.cn/api');
      if (response.data.success) {
        reports.value = response.data.data;
        currentReportIndex.value = 0;
        // 默认选中第一个分类
        selectedCategory.value = response.data.data[0]?.vid || null;
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