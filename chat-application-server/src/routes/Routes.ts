import { Request, Response, Application } from "express";
import * as path from "path";
import UserController from "../controllers/User";
/**
 * @class App
 * @author Gilles Cédric
 * @description this class is used to define all the routes of the application
 * @exports
 * @default
 * @since 21/05/2022
 */
export default class Routes {
  /**
   * @property userController
   * @description the User controller
   * @private
   * @readonly
   * @type {UserController}
   */
  private readonly userController: UserController = new UserController();

  /**
   * @method routes
   * @description this method define all the endpoints of the application
   * @readonly
   * @public
   * @returns {void}
   */
  public readonly routes = (app: Application): void => {
    //Default endpoint
    app.route("/api/").get((req: Request, res: Response) => {
      res
        .status(200)
        .sendFile(
          path.dirname(path.dirname(__dirname)) +
            "/public/index.html".replace("/", path.sep)
        );
    });

    app.route("/api/" + "users").get(this.userController.getAll);
    app.route("/api/" + "user").get(this.userController.get);
    app.route("/api/" + "user/login").post(this.userController.login);

    /*
        //User endpoints
        app.route('/api/' + this.version + '/users')
            .get(this.userController.getAll)

        app.route('/api/' + this.version + '/users/login').post(this.userController.login)

        app.route('/api/' + this.version + '/users/register').post(this.userController.register)

        app.route('/api/' + this.version + '/users/:userId')
            .get(this.userController.get)


            */
  };
}
