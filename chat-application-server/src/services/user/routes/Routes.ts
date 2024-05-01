import { Application } from "express";
import UserController from "../controllers/User";
import { UserValidators } from "../../../middlewares/Validators";

export default class Routes {
  private static readonly userController: UserController = new UserController();

  public static readonly routes = (app: Application): void => {
    app.route("/").get(this.userController.getAll)
    app.route("/token").put(...UserValidators.updateTokens, UserValidators.errors, this.userController.updateTokens)
    app.route("/token").post(...UserValidators.isValidTokens, UserValidators.errors, this.userController.isValidTokens)
    app.route("/me").get(...UserValidators.me, UserValidators.errors, this.userController.me)
    app.route("/signin").post(...UserValidators.signIn, UserValidators.errors, this.userController.signIn)
    app.route("/signup").post(...UserValidators.signUp, UserValidators.errors, this.userController.signUp)
    app.route("/friends").get(this.userController.getUserFriends)
    app.route("/friends/request")
      .post(...UserValidators.sendFriendRequest, UserValidators.errors, this.userController.sendFriendRequest)
      .get(...UserValidators.getUserFriendRequests, UserValidators.errors, this.userController.getUserFriendRequests)
    app.route("/friends/request/:id").put(...UserValidators.updateFriendRequest, UserValidators.errors, this.userController.updateUserFriendRequest)
    app.route("/checkUnique").post(this.userController.checkIfExists)
    app.route("/activate").get(...UserValidators.verify, UserValidators.errors, this.userController.activate)
    //app.route("/connect").post(this.userController.connect)
  }
}
