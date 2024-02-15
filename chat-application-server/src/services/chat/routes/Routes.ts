import { Request, Response, Application } from "express";
import * as path from "path";
import ChatController from "../controllers/Chat";



export default class Routes {

  private readonly ChatController: ChatController = new ChatController();

  public readonly routes = (app: Application): void => {

    app.route("/api/users/getChats").post(this.ChatController.getUserChats);

  };
}
