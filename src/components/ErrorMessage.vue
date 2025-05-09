<template>
  <div class="bg-red-100 border-l-4 border-red-500 text-red-700 p-4 rounded-lg my-8" role="alert">
    <p class="font-bold">加载失败</p>
    <p>{{ message }}</p>
    <button 
      @click="$emit('retry')" 
      class="mt-2 px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600 transition-colors"
    >
      重试
    </button>
  </div>
</template>

<script setup lang="ts">
defineProps<{
  message: string;
}>();

defineEmits<{
  (e: 'retry'): void;
}>();
</script>