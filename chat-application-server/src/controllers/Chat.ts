import { ChatModel } from "../schemas/ChatModel";
import { Request, Response } from "express";
/**
 * @class ChatController
 * @description this class is used to handle the request from the User endpoint
 * @author Jean-Loan BATCHO
 * @returns {Response}
 */

export default class ChatController {
  public readonly getAll = (req: Request, res: Response): Response => {
    if (ChatModel.find({}) === null) {
      return res.status(422).json([]);
    }
    ChatModel.find({}).then((chats) => {
      return res.status(200).json({
        chats,
      });
    });
  };

  public readonly get = (req: Request, res: Response): Response => {
    console.log(req.baseUrl);
    if (req.body.id === undefined) {
      return res.status(422).json({
        error: "Missing parameters.",
      });
    }
    const chatId = req.body.id;
    ChatModel.findById(chatId).then((chat) => {
      return res.status(200).json({
        chat,
      });
    });
  };

  public readonly getUserChats = (req: Request, res: Response): Response => {
    if (req.body.userId === undefined || req.body.friendId === undefined) {
      return res.status(422).json({
        error: "Missing parameters.",
      });
    }
    const userId = req.body.userId;
    const friendId = req.body.friendId;

    ChatModel.find({
      $or: [
        { sender: userId, receiver: friendId, deleted: false },
        { sender: friendId, receiver: userId, deleted: false },
      ],
    }) .populate('sender', 'firstname lastname') 
    .sort({ timestamp: 'asc' }).then((chats) => {
      // console.log(chats);
      return res.status(200).json({
        chats: chats,
      });
    });
  };
}
