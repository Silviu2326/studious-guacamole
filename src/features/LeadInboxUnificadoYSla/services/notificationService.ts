// US-09: Notification Service for Lead Responses

export interface NotificationSettings {
  enabled: boolean;
  sound: boolean;
  desktop: boolean;
  muteSchedule?: {
    enabled: boolean;
    startHour: number; // 0-23
    endHour: number; // 0-23
    muteDays?: number[]; // 0=Sunday, 6=Saturday
  };
}

let notificationSettings: NotificationSettings = {
  enabled: true,
  sound: true,
  desktop: true,
  muteSchedule: {
    enabled: true,
    startHour: 22, // 10 PM
    endHour: 8, // 8 AM
    muteDays: [0, 6] // Weekends
  }
};

class NotificationServiceClass {
  private audio: HTMLAudioElement | null = null;
  private permissionGranted = false;

  constructor() {
    this.initAudio();
    this.requestPermission();
  }

  private initAudio() {
    // Create a simple notification sound using Web Audio API
    try {
      this.audio = new Audio();
      // Data URL for a simple notification beep
      this.audio.src = 'data:audio/wav;base64,UklGRnoGAABXQVZFZm10IBAAAAABAAEAQB8AAEAfAAABAAgAZGF0YQoGAACBhYqFbF1fdJivrJBhNjVgodDbq2EcBj+a2/LDciUFLIHO8tiJNwgZaLvt559NEAxQp+PwtmMcBjiR1/LMeSwFJHfH8N2QQAoUXrTp66hVFApGn+DyvmwhBFCPzfHIeDEGA2ex0OnfkzgJEFKn5O+qVRUKSZzZ8r1rHwRLi8bl3pI7CxRbtOnrrFgVCj2S0uzCcyYGOGil6OKWPwsNUqvk7rNhGAUzh8vo4pE+DAg+k9XuwG8gA0GJzem+Zx4FTKDg8bhnHQRMm9fuz3QoB0CDy+jhkzwLEVOq5O6rVhMJSp3b8L9sIANLi8vo4ZI8CxFTquTuq1YTCUqd2/C/bCADS4vL6OGSPAsRU6rk7qtWEwlKndvwv2wgA0uLy+jhkzwLEVOq5O6rVhMJSp3b8L9sIANLi8vo4ZM8CxFTquTuq1YTCUqd2/C/bCADS4vL6OGTPAsRU6rk7qtWEwlKndvwv2wgA0uLy+jhkzwLEVOq5O6rVhMJSp3b8L9sIANLi8vo4ZM8CxFTquTuq1YTCUqd2/C/bCADS4vL6OGTPAsRU6rk7qtWEwlKndvwv2wgA0uLy+jhkzwLEVOq5O6rVhMJSp3b8L9sIANLi8vo4ZM8CxFTquTuq1YTCUqd2/C/bCADS4vL6OGTPAsRU6rk7qtWEwlKndvwv2wgA0uLy+jhkzwLEVOq5O6rVhMJSp3b8L9sIANLi8vo4ZM8CxFTquTuq1YTCUqd2/C/bCADS4vL6OGTPAsRU6rk7qtWEwlKndvwv2wgA0uLy+jhkzwLEVOq5O6rVhMJSp3b8L9sIANLi8vo4ZM8CxFTquTuq1YTCUqd2/C/bCADS4vL6OGTPAsRU6rk7qtWEwlKndvwv2wgA0uLy+jhkzwLEVOq5O6rVhMJSp3b8L9sIANLi8vo4ZM8CxFTquTuq1YTCUqd2/C/bCADS4vL6OGTPAsRU6rk7qtWEwlKndvwv2wgA0uLy+jhkzwLEVOq5O6rVhMJSp3b8L9sIANLi8vo4ZM8CxFTquTuq1YTCUqd2/C/bCADS4vL6OGTPAsRU6rk7qtWEwlKndvwv2wgA0uLy+jhkzwLEVOq5O6rVhMJSp3b8L9sIANLi8vo4ZM8CxFTquTuq1YTCQ==';
    } catch (e) {
      console.error('Could not initialize notification sound:', e);
    }
  }

  private async requestPermission() {
    if ('Notification' in window) {
      const permission = await Notification.requestPermission();
      this.permissionGranted = permission === 'granted';
    }
  }

  private isMuted(): boolean {
    if (!notificationSettings.muteSchedule?.enabled) return false;

    const now = new Date();
    const currentHour = now.getHours();
    const currentDay = now.getDay();

    const { startHour, endHour, muteDays } = notificationSettings.muteSchedule;

    // Check if current time is in mute schedule
    if (startHour > endHour) {
      // Crosses midnight
      if (currentHour >= startHour || currentHour < endHour) return true;
    } else {
      if (currentHour >= startHour && currentHour < endHour) return true;
    }

    // Check if current day is muted
    if (muteDays && muteDays.includes(currentDay)) return true;

    return false;
  }

  async notify(title: string, body: string, icon?: string) {
    if (!notificationSettings.enabled || this.isMuted()) return;

    // Play sound
    if (notificationSettings.sound && this.audio) {
      try {
        this.audio.currentTime = 0;
        await this.audio.play();
      } catch (e) {
        console.error('Could not play notification sound:', e);
      }
    }

    // Show desktop notification
    if (notificationSettings.desktop && this.permissionGranted && 'Notification' in window) {
      try {
        new Notification(title, {
          body,
          icon: icon || '/favicon.svg',
          badge: '/favicon.svg',
          tag: 'lead-response',
          requireInteraction: false,
        });
      } catch (e) {
        console.error('Could not show notification:', e);
      }
    }
  }

  getSettings(): NotificationSettings {
    return { ...notificationSettings };
  }

  updateSettings(settings: Partial<NotificationSettings>) {
    notificationSettings = { ...notificationSettings, ...settings };
    
    // Re-request permission if desktop notifications are enabled
    if (settings.desktop && !this.permissionGranted) {
      this.requestPermission();
    }
  }
}

export const NotificationService = new NotificationServiceClass();

