import { ref } from 'vue';

interface SpeechOptions {
  lang?: string;
  rate?: number;
  pitch?: number;
  volume?: number;
}

class TextToSpeechService {
  private static instance: TextToSpeechService;
  private speechSynthesis: SpeechSynthesis | undefined;
  private currentUtterance: SpeechSynthesisUtterance | undefined;
  private interruptionExpected = false;
  
  // 朗读状态
  public isReading = ref(false);
  public isPaused = ref(false);
  public currentText = ref('');

  private constructor() {
    if (typeof window !== 'undefined') {
      this.speechSynthesis = window.speechSynthesis;
      
      // 确保页面可见性变化时正确处理语音状态
      document.addEventListener('visibilitychange', this.handleVisibilityChange.bind(this));
      
      // 确保页面关闭时释放资源
      window.addEventListener('beforeunload', this.stopReading.bind(this));
    }
  }

  public static getInstance(): TextToSpeechService {
    if (!TextToSpeechService.instance) {
      TextToSpeechService.instance = new TextToSpeechService();
    }
    return TextToSpeechService.instance;
  }

  /**
   * 开始朗读文本
   */
  public startReading(text: string, options: SpeechOptions = {}): boolean {
    if (!this.speechSynthesis) {
      console.error('当前浏览器不支持语音合成API');
      return false;
    }

    // 检查是否正在朗读，确保在开始新朗读前停止当前朗读
    if (this.speechSynthesis.speaking || this.speechSynthesis.pending) {
      this.interruptionExpected = true; // 标记预期中断
      this.stopReading();
      // 添加小延迟确保上一个朗读已完全停止
      setTimeout(() => this.startReading(text, options), 100);
      return true;
    }

    try {
      this.currentUtterance = new SpeechSynthesisUtterance();
      this.currentUtterance.text = text;
      this.currentUtterance.lang = options.lang || 'zh-CN';
      this.currentUtterance.rate = options.rate || 1;
      this.currentUtterance.pitch = options.pitch || 1;
      this.currentUtterance.volume = options.volume || 1;

      // 设置事件处理
      this.currentUtterance.onstart = () => {
        this.isReading.value = true;
        this.isPaused.value = false;
        this.currentText.value = text;
        this.interruptionExpected = false; // 重置中断标记
      };

      this.currentUtterance.onend = () => {
        // 只有在没有期望中断的情况下才重置状态
        if (!this.interruptionExpected) {
          this.resetState();
        }
      };

      this.currentUtterance.onerror = (event) => {
        // 检查是否是预期中的中断错误
        if (event.error === 'interrupted' && this.interruptionExpected) {
          // 预期的中断，不需要特殊处理或记录错误
          return;
        }
        
        // 检查是否是'interrupted'类型的错误，即使interruptionExpected标志未设置
        if (event.error === 'interrupted') {
          // 中断错误通常发生在停止朗读时，可能是预期的，不记录错误
          return;
        }
        
        // 只记录非'interrupted'类型的错误
        console.error('语音合成错误:', event.error || event);
        
        // 只有在非手动停止的情况下重置状态
        if (this.isReading.value && !this.interruptionExpected) {
          this.resetState();
        }
      };

      this.speechSynthesis.speak(this.currentUtterance);
      return true;
    } catch (error) {
      console.error('语音合成初始化失败:', error);
      this.resetState();
      return false;
    }
  }

  /**
   * 暂停朗读
   */
  public pauseReading(): boolean {
    if (!this.speechSynthesis || !this.isReading.value || this.isPaused.value) {
      return false;
    }

    try {
      this.speechSynthesis.pause();
      this.isPaused.value = true;
      return true;
    } catch (error) {
      console.error('暂停朗读失败:', error);
      return false;
    }
  }

  /**
   * 恢复朗读
   */
  public resumeReading(): boolean {
    if (!this.speechSynthesis || !this.isReading.value || !this.isPaused.value) {
      return false;
    }

    try {
      this.speechSynthesis.resume();
      this.isPaused.value = false;
      return true;
    } catch (error) {
      console.error('恢复朗读失败:', error);
      return false;
    }
  }

  /**
   * 停止朗读
   */
  public stopReading(): boolean {
    if (!this.speechSynthesis) {
      return false;
    }

    try {
      this.interruptionExpected = true; // 确保在停止朗读时设置中断标记
      this.speechSynthesis.cancel();
      // 如果不是预期中断，才重置状态
      if (!this.interruptionExpected) {
        this.resetState();
      }
      return true;
    } catch (error) {
      console.error('停止朗读失败:', error);
      return false;
    }
  }

  /**
   * 切换朗读状态
   */
  public toggleReading(text: string, options: SpeechOptions = {}): boolean {
    if (this.isReading.value) {
      if (this.currentText.value === text) {
        if (this.isPaused.value) {
          return this.resumeReading();
        } else {
          return this.pauseReading();
        }
      } else {
        // 不同文本，标记期望中断
        this.interruptionExpected = true;
        this.stopReading();
        // 添加小延迟确保停止完成
        setTimeout(() => this.startReading(text, options), 100);
        return true;
      }
    } else {
      return this.startReading(text, options);
    }
  }

  /**
   * 检查是否支持语音合成
   */
  public isSpeechSupported(): boolean {
    return !!this.speechSynthesis;
  }

  /**
   * 重置状态
   */
  private resetState(): void {
    this.isReading.value = false;
    this.isPaused.value = false;
    this.currentText.value = '';
    this.currentUtterance = undefined;
    this.interruptionExpected = false;
  }

  /**
   * 处理页面可见性变化
   */
  private handleVisibilityChange(): void {
    if (!this.speechSynthesis) return;

    if (document.hidden && this.isReading.value && !this.isPaused.value) {
      // 当页面隐藏时暂停朗读，防止Chrome等浏览器自动停止语音合成
      this.pauseReading();
    } else if (!document.hidden && this.isReading.value && this.isPaused.value) {
      // 防止在切换回来时恢复已经不存在的语音
      try {
        if (this.speechSynthesis.paused) {
          this.resumeReading();
        }
      } catch (e) {
        // 如果恢复失败，重置状态
        this.resetState();
      }
    }
  }
}

export default TextToSpeechService.getInstance();