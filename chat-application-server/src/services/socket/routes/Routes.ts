import { Application } from "express"
import NotificationController from "../controllers/Socket"



export default class Routes {

  private static readonly notificationController: NotificationController = new NotificationController()

  public static readonly routes = (app: Application): void => {
    app.route("/").post( this.notificationController.emit)
  }
}
