export interface RumorItem {
  title: string;
  content: string;
}

export interface ReportData {
  vid: string;
  name: string;
  content: string;
  update_time: string;
}

export interface ApiResponse {
  success: boolean;
  data: ReportData[];
}

export type ThemeMode = 'light' | 'dark' | 'elderly';

export interface Category {
  id: string;
  name: string;
}