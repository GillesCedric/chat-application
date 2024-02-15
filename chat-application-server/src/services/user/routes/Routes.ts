import { Request, Response, Application } from "express";
import * as path from "path";
import UserController from "../controllers/User";



export default class Routes {

  private readonly userController: UserController = new UserController();

  public readonly routes = (app: Application): void => {

    app.route("/api/" + "users").get(this.userController.getAll);
    app.route("/api/" + "users").get(this.userController.get);
    app.route("/api/" + "users/login").post(this.userController.login);
    app.route("/api/" + "users/signup").post(this.userController.signUp);
    app.route("/api/users/getFriends").post(this.userController.getUserFriends);

  };
}
