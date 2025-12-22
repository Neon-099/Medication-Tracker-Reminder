import { createContext, useContext, useState, useEffect, type ReactNode } from 'react';

export interface AlarmSettings {
  sound: string;
  customSound?: string; // Base64 encoded audio data URL
  customSoundName?: string; // Name of the custom sound file
  volume: number;
  snoozeDuration: number; // in minutes
  repeatCount: number;
  vibrate: boolean;
}

export interface AppSettings {
  fontSize: 'normal' | 'large' | 'extra-large';
  defaultReminderTime: string;
  alarm: AlarmSettings;
}

interface SettingsContextType {
  settings: AppSettings;
  updateSettings: (updates: Partial<AppSettings>) => void;
  updateAlarmSettings: (updates: Partial<AlarmSettings>) => void;
  setCustomSound: (file: File) => Promise<void>;
  removeCustomSound: () => void;
}

const SettingsContext = createContext<SettingsContextType | undefined>(undefined);

const SETTINGS_STORAGE_KEY = 'app_settings';
const CUSTOM_SOUND_STORAGE_KEY = 'custom_alarm_sound';

const defaultSettings: AppSettings = {
  fontSize: 'normal',
  defaultReminderTime: '09:00',
  alarm: {
    sound: 'default',
    volume: 80,
    snoozeDuration: 10,
    repeatCount: 3,
    vibrate: true,
  },
};

export const SettingsProvider = ({ children }: { children: ReactNode }) => {
  const [settings, setSettings] = useState<AppSettings>(() => {
    const stored = localStorage.getItem(SETTINGS_STORAGE_KEY);
    const customSound = localStorage.getItem(CUSTOM_SOUND_STORAGE_KEY);
    
    if (stored) {
      try {
        const parsed = JSON.parse(stored);
        // Load custom sound from separate storage if it exists
        if (customSound) {
          parsed.alarm = {
            ...parsed.alarm,
            customSound: customSound,
            customSoundName: parsed.alarm?.customSoundName || 'Custom Sound',
          };
        }
        return { ...defaultSettings, ...parsed };
      } catch {
        return defaultSettings;
      }
    }
    return defaultSettings;
  });

  // Persist settings to localStorage
  useEffect(() => {
    const settingsToStore = { ...settings };
    // Don't store base64 audio in main settings (too large)
    const customSound = settingsToStore.alarm.customSound;
    const customSoundName = settingsToStore.alarm.customSoundName;
    
    if (customSound) {
      // Store custom sound separately
      localStorage.setItem(CUSTOM_SOUND_STORAGE_KEY, customSound);
      settingsToStore.alarm.customSoundName = customSoundName;
    } else {
      localStorage.removeItem(CUSTOM_SOUND_STORAGE_KEY);
    }
    
    // Remove customSound from main settings before storing
    delete settingsToStore.alarm.customSound;
    
    localStorage.setItem(SETTINGS_STORAGE_KEY, JSON.stringify(settingsToStore));
  }, [settings]);

  // Apply font size globally
  useEffect(() => {
    const root = document.documentElement;
    root.classList.remove('font-normal', 'font-large', 'font-extra-large');
    
    switch (settings.fontSize) {
      case 'large':
        root.classList.add('font-large');
        break;
      case 'extra-large':
        root.classList.add('font-extra-large');
        break;
      default:
        root.classList.add('font-normal');
    }
  }, [settings.fontSize]);

  const updateSettings = (updates: Partial<AppSettings>) => {
    setSettings((prev) => ({ ...prev, ...updates }));
  };

  const updateAlarmSettings = (updates: Partial<AlarmSettings>) => {
    setSettings((prev) => ({
      ...prev,
      alarm: { ...prev.alarm, ...updates },
    }));
  };

  const setCustomSound = async (file: File): Promise<void> => {
    return new Promise((resolve, reject) => {
      // Validate file type
      if (!file.type.startsWith('audio/')) {
        reject(new Error('Please select an audio file'));
        return;
      }

      // Validate file size (max 5MB)
      if (file.size > 5 * 1024 * 1024) {
        reject(new Error('File size must be less than 5MB'));
        return;
      }

      const reader = new FileReader();
      reader.onload = (e) => {
        const dataUrl = e.target?.result as string;
        updateAlarmSettings({
          customSound: dataUrl,
          customSoundName: file.name,
          sound: 'custom', // Automatically switch to custom sound
        });
        resolve();
      };
      reader.onerror = () => {
        reject(new Error('Failed to read file'));
      };
      reader.readAsDataURL(file);
    });
  };

  const removeCustomSound = () => {
    updateAlarmSettings({
      customSound: undefined,
      customSoundName: undefined,
      sound: settings.alarm.sound === 'custom' ? 'default' : settings.alarm.sound,
    });
    localStorage.removeItem(CUSTOM_SOUND_STORAGE_KEY);
  };

  return (
    <SettingsContext.Provider
      value={{
        settings,
        updateSettings,
        updateAlarmSettings,
        setCustomSound,
        removeCustomSound,
      }}
    >
      {children}
    </SettingsContext.Provider>
  );
};

export const useSettings = () => {
  const context = useContext(SettingsContext);
  if (!context) {
    throw new Error('useSettings must be used within SettingsProvider');
  }
  return context;
};