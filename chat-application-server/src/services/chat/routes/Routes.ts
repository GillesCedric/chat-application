import { Request, Response, Application } from "express";
import path from "path";
import ChatController from "../controllers/Chat";
import { ChatValidators } from "../../../middlewares/Validators";



export default class Routes {

  private static readonly ChatController: ChatController = new ChatController();

  public static readonly routes = (app: Application): void => {
    app.route("/conversations")
      .post(...ChatValidators.addConversation, ChatValidators.errors, this.ChatController.addConversation)
      .get(...ChatValidators.getUserConversations, ChatValidators.errors, this.ChatController.getUserConversations)
    app.route("/conversations/:id")
      .get(...ChatValidators.getUserConversationChats, ChatValidators.errors, this.ChatController.getUserConversationChats)
      .post(...ChatValidators.addChats, ChatValidators.errors, this.ChatController.addChats)
      .put(...ChatValidators.updateChat, ChatValidators.errors, this.ChatController.updateChat)

  };
}
