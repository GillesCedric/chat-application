import { Request, Response } from "express";
import JWTUtils from "../../../modules/jwt/JWT";
import { Crypto } from "../../../modules/crypto/Crypto";
import { Code } from "../../../utils/HTTP";
import { Tokens } from "../../../utils/Keywords";
import { NotificationModel, NotificationStatus } from "../../../models/Notification";


export default class NotificationController {
  public readonly getUserNotifications = async (req: Request, res: Response): Promise<Response> => {
    try {
      const userId = JWTUtils.getUserFromToken(req.body.access_token, Tokens.accessToken)

      const notifications = await NotificationModel.find({ receiver: userId })

      if (!notifications) {
        return res.status(422).json({
          error: "Cet utilisateur n'existe pas",
        });
      }

      return res.status(200).json({
        notifications,
      });

    } catch (error) {
      return res.status(422).json({
        error: "Impossible de récupérer les notifications",
      });
    }

  };

  public readonly sendNotification = async (req: Request, res: Response): Promise<Response> => {

    const userId = JWTUtils.getUserFromToken(req.body.access_token, "access_token")

    //check if the username exits
    try {
      console.log(req.body)
      const notification = await NotificationModel.insertMany({
        sender: userId,
        receiver: req.body.receiver,
        content: Crypto.encrypt(req.body.content, "database"),
        status: Crypto.encrypt(NotificationStatus.pending, "database")
      })

      //TODO make the request to the socket service

      // await NotificationModel.findByIdAndUpdate(user.id, {
      //   $push: { amis: friend.id }
      // }, { new: true }) // 'new: true' pour renvoyer le document après la mise à jour

      return res.status(200).json({
        message: "Notification envoyée avec succèss",
      })

    } catch (error) {
      console.log(error)
      return res.status(401).json({
        error: "Impossible d'envoyer la notification",
      });
    }

  };

  public readonly updateNotification = async (req: Request, res: Response): Promise<Response> => {
    const userId = JWTUtils.getUserFromToken(req.body.access_token, "access_token")

    //check if the username exits
    try {

      const notification = await NotificationModel.findOneAndUpdate({
        sender: userId,
      }, {
        status: Crypto.encrypt(NotificationStatus.deleted, "database")
      })

      //TODO make the request to the socket service to send socket to the user

      // await NotificationModel.findByIdAndUpdate(user.id, {
      //   $push: { amis: friend.id }
      // }, { new: true }) // 'new: true' pour renvoyer le document après la mise à jour

      return res.status(200).json({
        message: "Notification envoyée avec succèss",
      })

    } catch (error) {
      console.log(error)
      return res.status(401).json({
        error: "Impossible d'envoyer la notification",
      });
    }
  };

}
