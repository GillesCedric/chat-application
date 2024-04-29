import { Application } from "express"
import SocketController from "../controllers/Socket"



export default class Routes {

  private static readonly socketController: SocketController = new SocketController()

  public static readonly routes = (app: Application): void => {
    app.route("/").post(this.socketController.sendEventToUser)
  
  }
}
