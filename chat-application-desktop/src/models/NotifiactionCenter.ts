import { Notification } from "./Notification";
export class NotificationCenter {
  private notifications: Notification[];
  private static instance: NotificationCenter;
  public constructor() {}

  public static getInstance(): NotificationCenter {
    if (!NotificationCenter.instance) {
      NotificationCenter.instance = new NotificationCenter();
    }
    return NotificationCenter.instance;
  }

  public  getNotifications(): Notification[] {
    return this.notifications;
  }
  public addNotification = (notification: Notification): void => {
    this.notifications.push(notification);
  };
  public removeNotification = (notificationId: number): void => {
    this.notifications = this.notifications.filter(
      (notification) => notification.id != notificationId
    );
  };

  public markAsRead(notificationId: number): void {
    const notification = this.notifications.find(
      (nofitication) => nofitication.id === notificationId
    );
    if (notification) {
      notification.read = true;
    }
  }

  public markAllAsRead(): void {
    this.notifications.forEach((notification: Notification) => {
      notification.read = true;
    });
  }

  public deleteAll(): void {
    this.notifications = [];
  }
}
