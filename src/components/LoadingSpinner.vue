<template>
  <div 
    class="flex flex-col justify-center items-center py-12"
    :class="{ 'py-16': theme === 'elderly' }"
  >
    <!-- 主加载动画容器 -->
    <div class="elegant-loader">
      <!-- 波纹动画层 -->
      <div class="ripple-container">
        <div class="ripple"></div>
        <div class="ripple" style="animation-delay: 0.4s"></div>
        <div class="ripple" style="animation-delay: 0.8s"></div>
      </div>
      
      <!-- 旋转的环 -->
      <div class="spinning-ring"></div>
      
      <!-- 内部的脉动圆 -->
      <div class="pulse-circle"></div>
    </div>
    
    <!-- 加载文字 -->
    <p 
      class="mt-6 text-lg font-medium text-gray-600 dark:text-gray-300"
      :class="{ 'text-xl mt-8': theme === 'elderly' }"
    >
      <span class="loading-text">加载中</span>
      <span class="loading-dots">
        <span class="dot">.</span>
        <span class="dot">.</span>
        <span class="dot">.</span>
      </span>
    </p>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue';
import { useThemeStore } from '../stores/themeStore';

const themeStore = useThemeStore();
const theme = computed(() => themeStore.theme);
</script>

<style scoped>
.elegant-loader {
  position: relative;
  width: 80px;
  height: 80px;
  display: flex;
  align-items: center;
  justify-content: center;
}

/* 波纹效果 */
.ripple-container {
  position: absolute;
  width: 100%;
  height: 100%;
  top: 0;
  left: 0;
}

.ripple {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  margin: auto;
  width: 60px;
  height: 60px;
  border-radius: 50%;
  border: 2px solid rgba(59, 130, 246, 0.5);
  opacity: 0;
  animation: ripple-effect 2s cubic-bezier(0.23, 1, 0.32, 1) infinite;
}

.dark .ripple {
  border-color: rgba(96, 165, 250, 0.5);
}

/* 旋转的环 */
.spinning-ring {
  position: absolute;
  width: 50px;
  height: 50px;
  border-radius: 50%;
  border: 3px solid transparent;
  border-top-color: #3b82f6;
  border-right-color: #3b82f6;
  animation: spin-ring 1.5s linear infinite;
}

.dark .spinning-ring {
  border-top-color: #60a5fa;
  border-right-color: #60a5fa;
}

/* 内部的脉动圆 */
.pulse-circle {
  width: 20px;
  height: 20px;
  background-color: #3b82f6;
  border-radius: 50%;
  animation: pulse-beat 1.2s ease-in-out infinite alternate;
  box-shadow: 0 0 10px rgba(59, 130, 246, 0.5);
}

.dark .pulse-circle {
  background-color: #60a5fa;
  box-shadow: 0 0 15px rgba(96, 165, 250, 0.7);
}

/* 加载文字的点动画 */
.loading-text {
  display: inline-block;
  font-weight: 500;
}

.loading-dots {
  display: inline-block;
}

.dot {
  opacity: 0;
  display: inline-block;
  animation: dot-fade 1.4s infinite;
}

.dot:nth-child(1) {
  animation-delay: 0s;
}

.dot:nth-child(2) {
  animation-delay: 0.2s;
}

.dot:nth-child(3) {
  animation-delay: 0.4s;
}

/* 动画定义 */
@keyframes ripple-effect {
  0% {
    transform: scale(0.3);
    opacity: 0.8;
  }
  100% {
    transform: scale(1.5);
    opacity: 0;
  }
}

@keyframes spin-ring {
  0% {
    transform: rotate(0deg);
  }
  100% {
    transform: rotate(360deg);
  }
}

@keyframes pulse-beat {
  0% {
    transform: scale(0.8);
    opacity: 0.8;
  }
  100% {
    transform: scale(1.1);
    opacity: 1;
  }
}

@keyframes dot-fade {
  0%, 60%, 100% {
    opacity: 0;
  }
  30% {
    opacity: 1;
  }
}

/* 为老年模式调整样式 */
:deep(.elderly-mode) .elegant-loader {
  width: 100px;
  height: 100px;
}

:deep(.elderly-mode) .ripple {
  width: 80px;
  height: 80px;
  border-width: 3px;
}

:deep(.elderly-mode) .spinning-ring {
  width: 70px;
  height: 70px;
  border-width: 4px;
}

:deep(.elderly-mode) .pulse-circle {
  width: 30px;
  height: 30px;
}
</style>