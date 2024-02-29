import { Request, Response, Application } from "express";
import * as path from "path";
import UserController from "../controllers/User";



export default class Routes {

  private static readonly userController: UserController = new UserController();

  public static readonly routes = (app: Application): void => {

    app.route("/").get(this.userController.getAll)
    app.route("/me").get(this.userController.get)
    app.route("/signin").post(this.userController.login)
    app.route("/signup").post(this.userController.signUp)
    app.route("/getFriends").post(this.userController.getUserFriends)

  };
}
