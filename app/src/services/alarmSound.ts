import { type AlarmSettings } from '../context/SettingsContext';

class AlarmSoundService {
  private audioContext: AudioContext | null = null;
  private currentSound: AudioBufferSourceNode | null = null;
  private isPlaying = false;
  private repeatCount = 0;
  private maxRepeats = 0;
  private repeatTimeout: ReturnType<typeof setTimeout> | null = null;
//STRIK
  private initAudioContext() {
    if (!this.audioContext) {
      this.audioContext = new (window.AudioContext || (window as any).webkitAudioContext)();
    }
    return this.audioContext;
  }

  private async generateSound(type: string, _volume: number): Promise<AudioBuffer> {
    const ctx = this.initAudioContext();
    const sampleRate = ctx.sampleRate;
    const duration = 0.5; // 500ms
    const buffer = ctx.createBuffer(1, sampleRate * duration, sampleRate);
    const data = buffer.getChannelData(0);

    switch (type) {
      case 'gentle':
        // Gentle beep - soft sine wave
        for (let i = 0; i < data.length; i++) {
          const t = i / sampleRate;
          data[i] = Math.sin(2 * Math.PI * 440 * t) * Math.exp(-t * 2) * 0.3;
        }
        break;
      
      case 'classic':
        // Classic alarm - two-tone beep
        for (let i = 0; i < data.length; i++) {
          const t = i / sampleRate;
          const freq = t < 0.25 ? 523.25 : 659.25; // C5 or E5
          data[i] = Math.sin(2 * Math.PI * freq * t) * Math.exp(-t * 1.5) * 0.4;
        }
        break;
      
      case 'modern':
        // Modern - ascending tone
        for (let i = 0; i < data.length; i++) {
          const t = i / sampleRate;
          const freq = 440 + (t * 200); // Ascending frequency
          data[i] = Math.sin(2 * Math.PI * freq * t) * Math.exp(-t * 2) * 0.35;
        }
        break;
      
      case 'nature':
        // Nature - bird-like chirp
        for (let i = 0; i < data.length; i++) {
          const t = i / sampleRate;
          const freq = 800 + Math.sin(t * 10) * 200;
          data[i] = Math.sin(2 * Math.PI * freq * t) * Math.exp(-t * 3) * 0.3;
        }
        break;
      
      default: // 'default'
        // Default - standard beep
        for (let i = 0; i < data.length; i++) {
          const t = i / sampleRate;
          data[i] = Math.sin(2 * Math.PI * 600 * t) * Math.exp(-t * 2) * 0.4;
        }
    }

    return buffer;
  }

  private async loadCustomSound(dataUrl: string): Promise<AudioBuffer> {
    const ctx = this.initAudioContext();
    
    try {
      const response = await fetch(dataUrl);
      const arrayBuffer = await response.arrayBuffer();
      return await ctx.decodeAudioData(arrayBuffer);
    } catch (error) {
      console.error('Failed to load custom sound:', error);
      // Fallback to default sound if custom sound fails to load
      return this.generateSound('default', 80);
    }
  }

  private async playSoundBuffer(buffer: AudioBuffer, volume: number) {
    const ctx = this.initAudioContext();
    
    // Resume context if suspended (required for user interaction)
    if (ctx.state === 'suspended') {
      await ctx.resume();
    }

    const source = ctx.createBufferSource();
    const gainNode = ctx.createGain();
    
    source.buffer = buffer;
    gainNode.gain.value = volume / 100;
    
    source.connect(gainNode);
    gainNode.connect(ctx.destination);
    
    this.currentSound = source;
    source.start(0);
    
    return new Promise<void>((resolve) => {
      source.onended = () => {
        this.currentSound = null;
        resolve();
      };
    });
  }

  async playAlarm(settings: AlarmSettings, medicationName?: string) {
    if (this.isPlaying) {
      return; // Prevent multiple alarms from overlapping
    }

    this.isPlaying = true;
    this.maxRepeats = settings.repeatCount;
    this.repeatCount = 0;

    // Trigger vibration if enabled
    if (settings.vibrate && 'vibrate' in navigator) {
      try {
        navigator.vibrate([200, 100, 200, 100, 200]);
      } catch (e) {
        console.warn('Vibration not supported or failed');
      }
    }

    // Show browser notification if permission granted
    if ('Notification' in window && Notification.permission === 'granted') {
      new Notification('Medication Reminder', {
        body: medicationName 
          ? `Time to take ${medicationName}` 
          : 'Time to take your medication',
        icon: '/vite.svg',
        tag: 'medication-reminder',
      });
    }

    await this.playAlarmLoop(settings);
  }

  private async playAlarmLoop(settings: AlarmSettings) {
    while (this.repeatCount < this.maxRepeats && this.isPlaying) {
      let buffer: AudioBuffer;
      
      // Check if custom sound is selected and available
      if (settings.sound === 'custom' && settings.customSound) {
        buffer = await this.loadCustomSound(settings.customSound);
      } else {
        buffer = await this.generateSound(settings.sound, settings.volume);
      }
      
      await this.playSoundBuffer(buffer, settings.volume);
      
      this.repeatCount++;
      
      if (this.repeatCount < this.maxRepeats) {
        // Wait 0.5 seconds between repeats
        await new Promise(resolve => setTimeout(resolve, 500));
      }
    }
    
    this.isPlaying = false;
    this.repeatCount = 0;
  }

  stop() {
    this.isPlaying = false;
    if (this.repeatTimeout) {
      clearTimeout(this.repeatTimeout);
      this.repeatTimeout = null;
    }
    if (this.currentSound) {
      try {
        this.currentSound.stop();
      } catch (e) {
        // Sound may have already ended
      }
      this.currentSound = null;
    }
  }

  // Request notification permission
  async requestNotificationPermission(): Promise<boolean> {
    if (!('Notification' in window)) {
      return false;
    }

    if (Notification.permission === 'granted') {
      return true;
    }

    if (Notification.permission !== 'denied') {
      const permission = await Notification.requestPermission();
      return permission === 'granted';
    }

    return false;
  }
}

export const alarmSoundService = new AlarmSoundService();