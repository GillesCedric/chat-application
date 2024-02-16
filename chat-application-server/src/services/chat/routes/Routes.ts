import { Request, Response, Application } from "express";
import path from "path";
import ChatController from "../controllers/Chat";



export default class Routes {

  private static readonly ChatController: ChatController = new ChatController();

  public static readonly routes = (app: Application): void => {

    app.route('/login').get((req, res) => {
      
      return res.json({token: "token!"});
    })

    app.route('/test').get((req, res) => {

      return res.json({ message: "Hello!" });
    })

    app.route("/api/users/getChats").post(this.ChatController.getUserChats);

  };
}
