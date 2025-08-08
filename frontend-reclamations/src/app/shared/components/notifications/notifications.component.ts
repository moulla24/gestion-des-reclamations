import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NotificationService } from '../../services/notification.service';

@Component({
  selector: 'app-notifications',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="notifications-container">
      <div 
        *ngFor="let notification of notifications()" 
        class="notification notification-{{ notification.type }}"
      >
        <div class="notification-content">
          <span class="notification-icon">
            {{ getIcon(notification.type) }}
          </span>
          <span class="notification-message">{{ notification.message }}</span>
          <button 
            class="notification-close" 
            (click)="notificationService.removeNotification(notification.id)"
            title="Fermer"
          >
            ✕
          </button>
        </div>
        <div 
          *ngIf="notification.duration" 
          class="notification-progress"
          [style.animation-duration]="notification.duration + 'ms'"
        ></div>
      </div>
    </div>
  `,
  styleUrls: ['./notifications.component.css']
})
export class NotificationsComponent {
  notificationService = inject(NotificationService);
  
  get notifications() {
    return this.notificationService.getNotifications();
  }

  getIcon(type: string): string {
    switch (type) {
      case 'success': return '✅';
      case 'error': return '❌';
      case 'warning': return '⚠️';
      case 'info': return 'ℹ️';
      default: return '📢';
    }
  }
}
