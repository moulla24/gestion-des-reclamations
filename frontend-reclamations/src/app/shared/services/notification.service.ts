import { Injectable, signal } from '@angular/core';

export interface Notification {
  id: string;
  message: string;
  type: 'success' | 'error' | 'warning' | 'info';
  duration?: number;
  timestamp: Date;
}

@Injectable({
  providedIn: 'root'
})
export class NotificationService {
  private notifications = signal<Notification[]>([]);

  getNotifications() {
    return this.notifications.asReadonly();
  }

  showSuccess(message: string, duration: number = 5000) {
    this.addNotification(message, 'success', duration);
  }

  showError(message: string, duration: number = 8000) {
    this.addNotification(message, 'error', duration);
  }

  showWarning(message: string, duration: number = 6000) {
    this.addNotification(message, 'warning', duration);
  }

  showInfo(message: string, duration: number = 4000) {
    this.addNotification(message, 'info', duration);
  }

  private addNotification(message: string, type: Notification['type'], duration: number) {
    const notification: Notification = {
      id: this.generateId(),
      message,
      type,
      duration,
      timestamp: new Date()
    };

    this.notifications.update(notifications => [...notifications, notification]);

    if (duration > 0) {
      setTimeout(() => {
        this.removeNotification(notification.id);
      }, duration);
    }
  }

  removeNotification(id: string) {
    this.notifications.update(notifications => 
      notifications.filter(n => n.id !== id)
    );
  }

  clearAll() {
    this.notifications.set([]);
  }

  private generateId(): string {
    return Math.random().toString(36).substr(2, 9);
  }
}
