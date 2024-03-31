import { Application } from "express"
import UserController from "../controllers/User"
import Validators from "../../../middlewares/Validators"



export default class Routes {

  private static readonly userController: UserController = new UserController()

  public static readonly routes = (app: Application): void => {

    app.route("/").get(this.userController.getAll)
    app.route("/token").put(this.userController.updateTokens)
    app.route("/token").post(this.userController.isValidTokens)
    app.route("/me").get(this.userController.me)
    app.route("/signin").post(...Validators.signIn, Validators.errors, this.userController.signIn)
    app.route("/signup").post(...Validators.signUp, Validators.errors, this.userController.signUp)
    app.route("/friends").get(this.userController.getUserFriends)
    app.route("/friends").post(this.userController.addFriend)
    app.route("/friends/:id").delete(this.userController.deleteFriend)

  }
}
