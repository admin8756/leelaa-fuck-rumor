<template>
  <div 
    class="card relative mb-4 sm:mb-8 transform hover:scale-[1.01] transition-all duration-200 overflow-hidden"
    :class="{ 
      'bg-elderly-card': theme === 'elderly',
      'p-4 sm:p-6': theme === 'elderly',
      'shadow-md sm:shadow-lg': theme !== 'elderly',
      'shadow-lg sm:shadow-xl': theme === 'elderly',
    }"
  >
    <div class="flex flex-col h-full">
      <!-- Title Section -->
      <div class="mb-3 sm:mb-4 border-b pb-2 sm:pb-3" :class="{ 'border-gray-200 dark:border-gray-700': true }">
        <h3 
          class="text-lg sm:text-xl font-bold text-blue-800 dark:text-blue-300" 
          :class="{ 'text-xl sm:text-2xl mb-1 sm:mb-2': theme === 'elderly' }"
        >
          {{ rumor.title }}
        </h3>
      </div>
      
      <!-- Content Section -->
      <div class="flex-grow mb-4 sm:mb-6">
        <p 
          class="text-gray-700 dark:text-gray-300 whitespace-pre-line" 
          :class="{ 
            'text-lg sm:text-xl leading-relaxed': theme === 'elderly',
            'leading-relaxed': theme !== 'elderly' 
          }"
        >
          {{ rumor.content }}
        </p>
      </div>
      
      <!-- Actions Section -->
      <div class="flex flex-wrap justify-end gap-2 sm:space-x-3 mt-auto pt-2 border-t" :class="{ 'border-gray-200 dark:border-gray-700': true }">
        <button 
          @click="handleReadAloud"
          class="btn btn-secondary flex items-center transition-all relative text-sm sm:text-base"
          :class="{ 
            'text-base sm:text-lg px-3 sm:px-5 py-2 sm:py-3': theme === 'elderly', 
            'bg-blue-50 dark:bg-blue-900 hover:bg-blue-100 dark:hover:bg-blue-800': isCurrentRumor,
            'text-blue-700 dark:text-blue-300': isCurrentRumor
          }"
          title="语音朗读"
        >
          <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4 sm:h-5 sm:w-5 mr-1 sm:mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path 
              v-if="!isCurrentRumor || (isCurrentRumor && textToSpeech.isPaused.value)" 
              stroke-linecap="round" 
              stroke-linejoin="round" 
              stroke-width="2" 
              d="M15.536 8.464a5 5 0 010 7.072m2.828-9.9a9 9 0 010 12.728M5.586 15H4a1 1 0 01-1-1v-4a1 1 0 011-1h1.586l4.707-4.707C10.923 3.663 12 4.109 12 5v14c0 .891-1.077 1.337-1.707.707L5.586 15z" 
            />
            <path 
              v-else 
              stroke-linecap="round" 
              stroke-linejoin="round" 
              stroke-width="2" 
              d="M10 9v6m4-6v6m7-3a9 9 0 11-18 0 9 9 0 0118 0z" 
            />
          </svg>
          {{ buttonText }}
          
          <!-- 语音波动画效果 -->
          <div 
            v-if="isCurrentRumor && !textToSpeech.isPaused.value" 
            class="absolute right-1 sm:right-2 top-1/2 transform -translate-y-1/2 flex items-center space-x-0.5"
            aria-hidden="true"
          >
            <div class="sound-wave-bar"></div>
            <div class="sound-wave-bar" style="animation-delay: 0.2s"></div>
            <div class="sound-wave-bar" style="animation-delay: 0.1s"></div>
          </div>
        </button>
        
        <button 
          @click="copyContent"
          class="btn btn-secondary flex items-center transition-all text-sm sm:text-base"
          :class="{ 
            'text-base sm:text-lg px-3 sm:px-5 py-2 sm:py-3': theme === 'elderly',
            'bg-green-50 dark:bg-green-900 text-green-700 dark:text-green-300': copySuccess,
            'hover:bg-gray-100 dark:hover:bg-gray-700': !copySuccess
          }"
          title="复制内容"
        >
          <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4 sm:h-5 sm:w-5 mr-1 sm:mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" />
          </svg>
          {{ copySuccess ? '已复制' : '复制' }}
        </button>
      </div>
    </div>
    
    <!-- 卡片角落的音频指示器 -->
    <div 
      v-if="isCurrentRumor && !textToSpeech.isPaused.value" 
      class="audio-indicator"
      aria-label="正在朗读"
    >
      <div class="audio-wave">
        <div class="audio-wave-bar"></div>
        <div class="audio-wave-bar"></div>
        <div class="audio-wave-bar"></div>
        <div class="audio-wave-bar"></div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, watch, onBeforeUnmount } from 'vue';
import type { RumorItem } from '../types';
import { useThemeStore } from '../stores/themeStore';
import textToSpeech from '../services/TextToSpeech';

const props = defineProps<{
  rumor: RumorItem;
}>();

const themeStore = useThemeStore();
const theme = computed(() => themeStore.theme);

// 本地组件状态
const copySuccess = ref(false);
const rumourText = computed(() => `${props.rumor.title}。辟谣观点：${props.rumor.content}`);

// 判断当前谣言是否正在被朗读
const isCurrentRumor = computed(() => {
  return textToSpeech.isReading.value && 
         textToSpeech.currentText.value === rumourText.value;
});

// 按钮文本根据朗读状态变化
const buttonText = computed(() => {
  if (!isCurrentRumor.value) return '朗读';
  if (textToSpeech.isPaused.value) return '继续';
  return '暂停';
});

// 处理朗读按钮点击
const handleReadAloud = () => {
  if (!textToSpeech.isSpeechSupported()) {
    alert('您的浏览器不支持语音朗读功能');
    return;
  }

  textToSpeech.toggleReading(rumourText.value, {
    lang: 'zh-CN',
    rate: theme.value === 'elderly' ? 0.8 : 1,
    pitch: 1,
    volume: 1
  });
};

// 复制内容到剪贴板
const copyContent = () => {
  const content = `${props.rumor.title}\n辟谣观点：${props.rumor.content}`;
  
  navigator.clipboard.writeText(content)
    .then(() => {
      copySuccess.value = true;
      setTimeout(() => {
        copySuccess.value = false;
      }, 2000);
    })
    .catch(err => {
      console.error('复制失败:', err);
      alert('复制失败，请手动复制');
    });
};

// 在组件被销毁前停止正在朗读的内容
onBeforeUnmount(() => {
  if (isCurrentRumor.value) {
    textToSpeech.stopReading();
  }
});

// 监听谣言变化，如果当前谣言正在朗读但内容发生变化，则停止朗读
watch(() => props.rumor, (oldVal) => {
  const oldRumourText = `${oldVal.title}。辟谣观点：${oldVal.content}`;
  if (textToSpeech.isReading.value && textToSpeech.currentText.value === oldRumourText) {
    textToSpeech.stopReading();
  }
}, { deep: true });
</script>

<style scoped>
.card {
  background-color: var(--card-bg, theme('colors.white'));
  border-radius: 0.75rem;
  padding: 1rem;
  transition: all 0.3s ease;
}

.dark .card {
  background-color: var(--card-bg-dark, theme('colors.gray.800'));
}

@media (min-width: 640px) {
  .card {
    padding: 1.25rem;
  }
}

/* 朗读按钮内的声波动画 */
.sound-wave-bar {
  width: 2px;
  height: 6px;
  background-color: currentColor;
  animation: sound-wave-animation 0.8s infinite ease-in-out;
  border-radius: 1px;
}

@media (min-width: 640px) {
  .sound-wave-bar {
    height: 8px;
  }
}

@keyframes sound-wave-animation {
  0%, 100% {
    height: 4px;
  }
  50% {
    height: 10px;
  }
}

@media (min-width: 640px) {
  @keyframes sound-wave-animation {
    0%, 100% {
      height: 4px;
    }
    50% {
      height: 12px;
    }
  }
}

/* 卡片角落的音频指示器 */
.audio-indicator {
  position: absolute;
  top: 6px;
  right: 6px;
  padding: 4px;
  background-color: rgba(37, 99, 235, 0.1);
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  box-shadow: 0 0 6px rgba(37, 99, 235, 0.3);
  animation: pulse 2s infinite;
}

@media (min-width: 640px) {
  .audio-indicator {
    top: 8px;
    right: 8px;
    padding: 6px;
    box-shadow: 0 0 8px rgba(37, 99, 235, 0.3);
  }
}

.dark .audio-indicator {
  background-color: rgba(96, 165, 250, 0.2);
  box-shadow: 0 0 8px rgba(96, 165, 250, 0.3);
}

.audio-wave {
  display: flex;
  align-items: center;
  height: 12px;
  gap: 1px;
}

@media (min-width: 640px) {
  .audio-wave {
    height: 16px;
    gap: 2px;
  }
}

.audio-wave-bar {
  width: 1px;
  height: 6px;
  background-color: rgb(37, 99, 235);
  border-radius: 1px;
}

@media (min-width: 640px) {
  .audio-wave-bar {
    width: 2px;
    height: 8px;
  }
}

.dark .audio-wave-bar {
  background-color: rgb(96, 165, 250);
}

.audio-wave-bar:nth-child(1) {
  animation: wave-animation 0.9s infinite ease-in-out;
  animation-delay: 0.1s;
}

.audio-wave-bar:nth-child(2) {
  animation: wave-animation 0.9s infinite ease-in-out;
  animation-delay: 0.3s;
}

.audio-wave-bar:nth-child(3) {
  animation: wave-animation 0.9s infinite ease-in-out;
  animation-delay: 0.5s;
}

.audio-wave-bar:nth-child(4) {
  animation: wave-animation 0.9s infinite ease-in-out;
  animation-delay: 0.7s;
}

@keyframes wave-animation {
  0%, 100% {
    height: 3px;
  }
  50% {
    height: 10px;
  }
}

@media (min-width: 640px) {
  @keyframes wave-animation {
    0%, 100% {
      height: 4px;
    }
    50% {
      height: 16px;
    }
  }
}

@keyframes pulse {
  0% {
    box-shadow: 0 0 0 0 rgba(37, 99, 235, 0.4);
  }
  70% {
    box-shadow: 0 0 0 4px rgba(37, 99, 235, 0);
  }
  100% {
    box-shadow: 0 0 0 0 rgba(37, 99, 235, 0);
  }
}

@media (min-width: 640px) {
  @keyframes pulse {
    0% {
      box-shadow: 0 0 0 0 rgba(37, 99, 235, 0.4);
    }
    70% {
      box-shadow: 0 0 0 6px rgba(37, 99, 235, 0);
    }
    100% {
      box-shadow: 0 0 0 0 rgba(37, 99, 235, 0);
    }
  }
}

.dark @keyframes pulse {
  0% {
    box-shadow: 0 0 0 0 rgba(96, 165, 250, 0.4);
  }
  70% {
    box-shadow: 0 0 0 4px rgba(96, 165, 250, 0);
  }
  100% {
    box-shadow: 0 0 0 0 rgba(96, 165, 250, 0);
  }
}

@media (min-width: 640px) {
  .dark @keyframes pulse {
    0% {
      box-shadow: 0 0 0 0 rgba(96, 165, 250, 0.4);
    }
    70% {
      box-shadow: 0 0 0 6px rgba(96, 165, 250, 0);
    }
    100% {
      box-shadow: 0 0 0 0 rgba(96, 165, 250, 0);
    }
  }
}
</style>