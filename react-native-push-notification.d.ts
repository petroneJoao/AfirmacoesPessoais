// react-native-push-notification.d.ts
declare module 'react-native-push-notification' {
    export interface PushNotificationOptions {
      onRegister?: (token: { os: string; token: string }) => void;
      onNotification?: (notification: any) => void;
      onRegistrationError?: (error: { message: string }) => void;
      permissions?: {
        alert?: boolean;
        badge?: boolean;
        sound?: boolean;
      };
      popInitialNotification?: boolean;
      requestPermissions?: boolean;
    }
  
    export interface LocalNotificationSchedule {
      message: string;
      title?: string;
      date: Date;
      repeatType?: 'day' | 'week' | 'month' | 'year';
    }
  
    export class PushNotification {
      static configure(options: PushNotificationOptions): void;
      static localNotificationSchedule(options: LocalNotificationSchedule): void;
      static cancelAllLocalNotifications(): void;
    }
  
    export default PushNotification;
  }