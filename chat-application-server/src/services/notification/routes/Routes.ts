import { Application } from "express";
import NotificationController from "../controllers/Notification";
import { NotificationValidators } from "../../../middlewares/Validators";

export default class Routes {
  private static readonly notificationController: NotificationController =
    new NotificationController();

  public static readonly routes = (app: Application): void => {
    app.route("/:id").put(...NotificationValidators.updateNotification, NotificationValidators.errors, this.notificationController.updateNotification)
    app.route("/")
      .post(...NotificationValidators.sendNotification, NotificationValidators.errors, this.notificationController.sendNotification)
      .get(...NotificationValidators.getNotifications, NotificationValidators.errors, this.notificationController.getUserNotifications)
  
  }
}
