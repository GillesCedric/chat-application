import { Application } from "express";
import UserController from "../controllers/User";
import { UserValidators } from "../../../middlewares/Validators";
import rateLimit from "express-rate-limit";

export default class Routes {
  private static readonly userController: UserController = new UserController();

  public static readonly routes = (app: Application): void => {
    app.route("/").get(this.userController.getAll)
    app.route("/token").put(...UserValidators.updateTokens, UserValidators.errors, this.userController.updateTokens)
    app.route("/token").post(...UserValidators.isValidTokens, UserValidators.errors, this.userController.isValidTokens)
    app.route("/me")
      .get(...UserValidators.me, UserValidators.errors, this.userController.me)
      .patch(...UserValidators.updateProfile, UserValidators.errors, this.userController.updateProfile)
    app.route("/signin").post(rateLimit({
      windowMs: 15 * 60 * 1000, // 15 minutes
      max: 5, // Limite chaque IP à 5 tentatives de connexion par fenêtre de 15 minutes
      message: 'Trop de tentatives de connexion, veuillez réessayer après 15 minutes',
      standardHeaders: 'draft-7',
      legacyHeaders: false,
    }),...UserValidators.signIn, UserValidators.errors, this.userController.signIn)
    app.route("/signup").post(...UserValidators.signUp, UserValidators.errors, this.userController.signUp)
    app.route("/friends").get(this.userController.getUserFriends)
    app.route("/friends/request")
      .post(...UserValidators.sendFriendRequest, UserValidators.errors, this.userController.sendFriendRequest)
      .get(...UserValidators.getUserFriendRequests, UserValidators.errors, this.userController.getUserFriendRequests)
    app.route("/friends/request/:id").put(...UserValidators.updateFriendRequest, UserValidators.errors, this.userController.updateUserFriendRequest)
    app.route("/checkUnique").post(...UserValidators.checkUnique, UserValidators.errors, this.userController.checkIfExists)
    app.route("/activate/email").get(...UserValidators.activateEmail, UserValidators.errors, this.userController.activateEmail)
    app.route("/activate/tel").post(...UserValidators.activateTel, UserValidators.errors, this.userController.activateTel)
    app.route("/verify/tel").post(...UserValidators.verifyTel, UserValidators.errors, this.userController.verifyTel)
    app.route("/connect").post(...UserValidators.connect, UserValidators.errors, this.userController.connect)
    app.route("/signout").post(...UserValidators.signOut, UserValidators.errors, this.userController.signOut)
  }
}
