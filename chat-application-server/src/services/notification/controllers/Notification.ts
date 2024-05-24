import { Request, Response } from "express";
import JWTUtils from "../../../modules/jwt/JWT";
import { Crypto } from "../../../modules/crypto/Crypto";
import { Code, headers, protocol } from "../../../utils/HTTP";
import { Services, SocketKeywords, Tokens } from "../../../utils/Keywords";
import { NotificationModel, NotificationStatus } from "../../../models/Notification";
import SERVICES from '../../../config/services.json'
import { NotificationLogger as Logger } from '../../../modules/logger/Logger'


export default class NotificationController {
  public readonly getUserNotifications = async (req: Request, res: Response): Promise<Response> => {
    try {
      const userId = await JWTUtils.getUserFromToken(req.query.access_token as string, req.headers['user-agent'], Tokens.accessToken)

      const notifications = await NotificationModel.find({
        receiver: userId,
        status: Crypto.encrypt(NotificationStatus.pending, "status")
      })

      if (!notifications) {
        return res.status(422).json({
          error: "Cet utilisateur n'existe pas",
        });
      }

      const decryptedNotifications = notifications.map(notification => {
       
        return {
          _id: notification._id,
          sender: notification.sender,
          receiver: notification.receiver,
          content: Crypto.decrypt(notification.content, "database"),
          status: Crypto.decrypt(notification.status, "status"),
          createdAt: notification.createdAt,
          updatedAt: notification.updatedAt
        }
      })

      return res.status(200).json({
        message: "success",
        data: decryptedNotifications,
      });

    } catch (error) {
      Logger.error(error)
      return res.status(422).json({
        error: "Impossible de récupérer les notifications",
      });
    }

  };

  public readonly sendNotification = async (req: Request, res: Response): Promise<Response> => {

    const userId = await JWTUtils.getUserFromToken(req.body.access_token, req.headers['user-agent'], "access_token")

    try {

      await Promise.all([
        NotificationModel.insertMany({
          sender: userId,
          receiver: req.body.receiver,
          content: Crypto.encrypt(req.body.content, "database"),
          status: Crypto.encrypt(NotificationStatus.pending, "status")
        }),
        fetch(`${protocol()}://${SERVICES[process.env.NODE_ENV][Services.socket].domain}:${SERVICES[process.env.NODE_ENV][Services.socket].port}/`, {
          method: 'POST',
          headers: headers(req.headers["user-agent"]),
          body: JSON.stringify({
            access_token: req.body.access_token,
            receiver: req.body.receiver,
            data: req.body.content,
            event: SocketKeywords.newNotification
          })
        })
      ])

      return res.status(200).json({
        message: "Notification envoyée avec succèss",
      })

    } catch (error) {
      Logger.error(error)
      return res.status(401).json({
        error: "Impossible d'envoyer la notification",
      });
    }

  };

  public readonly updateNotification = async (req: Request, res: Response): Promise<Response> => {
    const userId = await JWTUtils.getUserFromToken(req.body.access_token, req.headers['user-agent'], "access_token")

    //check if the username exits
    try {

      await NotificationModel.findByIdAndUpdate(req.params.id, {
        status: Crypto.encrypt(NotificationStatus.deleted, "status")
      })

      return res.status(200).json({
        message: "Notification modifiée avec succèss",
      })

    } catch (error) {
      Logger.error(error)
      return res.status(401).json({
        error: "Impossible d'envoyer la notification",
      });
    }
  };

}
