import { ConversationModel } from "../../../models/Conversation";
import { ChatModel } from "../../../models/Chat";
import { Request, Response } from "express";
import JWTUtils from "../../../modules/jwt/JWT";
import { protocol, headers, Method } from "../../../utils/HTTP";
import { Services, SocketKeywords, Tokens } from "../../../utils/Keywords";
import SERVICES from '../../../config/services.json'
import mongoose from "mongoose";
import { Crypto } from "../../../modules/crypto/Crypto";
import { UserModel } from "../../../models/User";



export default class ChatController {

  private readonly checkIfConversationExists = async (members: mongoose.Types.ObjectId[]) => {
    try {
      // Tri des membres pour garantir la cohérence dans la requête
      const sortedMembers = members.slice().sort((a, b) => a.toString().localeCompare(b.toString()))

      const conversation = await ConversationModel.findOne({ members: { $all: sortedMembers, $size: sortedMembers.length } })

      if (conversation) return true

      return false
    } catch (error) {
      console.log(error)
      return null
    }

  }

  public readonly addConversation = async (req: Request, res: Response): Promise<Response> => {

    try {

      const userId = await JWTUtils.getUserFromToken(req.body.access_token, req.headers['user-agent'], Tokens.accessToken)

      if (await this.checkIfConversationExists(req.body.members)) {
        return res.status(401).json({
          error: "Cette conversation existe déjà",
        });
      }

      const conversation = new ConversationModel({ members: req.body.members.sort((a: mongoose.Types.ObjectId, b: mongoose.Types.ObjectId) => a.toString().localeCompare(b.toString())) });

      const savedConversation = await conversation.save()

      const otherMember = await UserModel.findById(savedConversation.members.find(id => !id.equals(userId)))

      await Promise.all([
        fetch(`${protocol()}://${SERVICES[process.env.NODE_ENV][Services.socket].domain}:${SERVICES[process.env.NODE_ENV][Services.socket].port}/`, {
          method: Method.post,
          headers: headers(req.headers["user-agent"]),
          body: JSON.stringify({
            access_token: req.body.access_token,
            receiver: req.body.members[0],
            data: {
              _id: savedConversation._id,
              lastMessageDate: null,
              lastMessageDetails: null,
              unreadCount: 0,
              userId: otherMember._id,
              username: Crypto.decrypt(otherMember.username, "username"),
              picture: Crypto.decrypt(otherMember.picture, "database"),
              status: Crypto.decrypt(otherMember.status, "status")
            },
            event: SocketKeywords.newConversation
          })
        })
        ,
        fetch(`${protocol()}://${SERVICES[process.env.NODE_ENV][Services.socket].domain}:${SERVICES[process.env.NODE_ENV][Services.socket].port}/`, {
          method: Method.post,
          headers: headers(req.headers["user-agent"]),
          body: JSON.stringify({
            access_token: req.body.access_token,
            receiver: req.body.members[1],
            data: {
              _id: savedConversation._id,
              lastMessageDate: null,
              lastMessageDetails: null,
              unreadCount: 0,
              userId: otherMember._id,
              username: Crypto.decrypt(otherMember.username, "username"),
              picture: Crypto.decrypt(otherMember.picture, "database"),
              status: Crypto.decrypt(otherMember.status, "status")
            },
            event: SocketKeywords.newConversation
          })
        })
      ])

      return res.status(200).json({
        message: "Conversation enregistrée avec succèss",
      })

    } catch (error) {
      console.log(error)
      return res.status(401).json({
        error: "Impossible d'enregistrer la conversation",
      });
    }

  };

  public readonly getUserConversationChats = async (req: Request, res: Response): Promise<Response> => {

    const userId = await JWTUtils.getUserFromToken(req.query.access_token as string, req.headers['user-agent'], Tokens.accessToken)

    try {

      const chats = await ChatModel.find({
        conversation: req.params.id
      }).select("message status createdAt sender")

      if (!chats) {
        return res.status(401).json({
          error: "Cette conversation n'a aucun chat",
        });
      }

      return res.status(200).json({
        message: 'success',
        data: chats.map(chat => ({
          _id: chat._id,
          sender: chat.sender,
          message: Crypto.decrypt(chat.message, "database"),
          readBy: chat.readBy,
          createdAt: chat.createdAt,
          isOwnedByUser: chat.sender.toString() === userId
        }))
      })

    } catch (error) {
      console.log(error)
      return res.status(401).json({
        error: "Impossible de récupérer les chats de cette conversation",
      });
    }

  };

  public readonly getUserConversations = async (req: Request, res: Response): Promise<Response> => {

    try {

      const userId = await JWTUtils.getUserFromToken(req.query.access_token as string, req.headers['user-agent'], Tokens.accessToken)

      let conversations = await ConversationModel.aggregate([
        { $match: { members: new mongoose.Types.ObjectId(userId) } },
        {
          $lookup: {
            from: 'users',
            localField: 'members',
            foreignField: '_id',
            as: 'memberDetails'
          }
        },
        { $unwind: '$memberDetails' },
        { $match: { 'memberDetails._id': { $ne: new mongoose.Types.ObjectId(userId) } } },
        {
          $lookup: {
            from: 'chats',
            let: { conversationId: '$_id' },
            pipeline: [
              {
                $match: {
                  $expr: {
                    $and: [
                      { $eq: ['$conversation', '$$conversationId'] },
                      { $ne: ['$deleted', Crypto.encrypt("true", "boolean")] }
                    ]
                  }
                }
              },
              { $sort: { createdAt: -1 } },
              { $limit: 1 }
            ],
            as: 'lastMessage'
          }
        },
        {
          $lookup: {
            from: 'chats',
            let: { conversationId: '$_id' },
            pipeline: [
              {
                $match: {
                  $expr: {
                    $and: [
                      { $eq: ['$conversation', '$$conversationId'] },
                      { $not: [{ $in: [new mongoose.Types.ObjectId(userId), '$readBy'] }] },
                    ]
                  }
                }
              }
            ],
            as: 'unreadMessages'
          }
        },
        {
          $addFields: {
            lastMessageDate: { $arrayElemAt: ['$lastMessage.createdAt', 0] },
            lastMessageDetails: { $arrayElemAt: ['$lastMessage', 0] },
            unreadCount: { $size: '$unreadMessages' } // Calcul du nombre de messages non lus
          }
        },
        {
          $project: {
            _id: 1,
            'memberDetails.firstname': 1,
            'memberDetails.lastname': 1,
            'memberDetails.picture': 1,
            'memberDetails.status': 1,
            'lastMessageDetails.message': 1,
            'lastMessageDate': 1,
            unreadCount: 1
          }
        }
      ])

      if (!conversations) {
        return res.status(401).json({
          error: "Vous n'avez aucune conversations",
        });
      }

      conversations = conversations.map(conversation => {
        // Déchiffrer les détails de chaque membre
        // Retourner la conversation mise à jour avec les membres déchiffrés
        console.log(conversation);
        return {
          _id: conversation._id,
          lastMessage: {
            date: conversation.lastMessageDate,
            message: conversation.lastMessageDetails && conversation.lastMessageDetails.message && Crypto.decrypt(conversation.lastMessageDetails.message, "database")
          },
          unreadCount: conversation.unreadCount,
          fullname: `${Crypto.decrypt(conversation.memberDetails.firstname, 'database')} ${Crypto.decrypt(conversation.memberDetails.lastname, 'database')}`,
          picture: Crypto.decrypt(conversation.memberDetails.picture, "database"),
          status: Crypto.decrypt(conversation.memberDetails.status, "status"),
        };
      });


      return res.status(200).json({
        message: 'success',
        data: conversations,
      })

    } catch (error) {
      console.log(error)
      return res.status(401).json({
        error: "Impossible de récupérer la liste des conversations",
      });
    }

  };

  public readonly addChats = async (req: Request, res: Response): Promise<Response> => {

    const userId = await JWTUtils.getUserFromToken(req.body.access_token, req.headers['user-agent'], Tokens.accessToken)

    try {
      // Créer un nouvel objet chat
      const chat = new ChatModel({
        conversation: new mongoose.Types.ObjectId(req.params.id),
        sender: new mongoose.Types.ObjectId(userId),
        message: Crypto.encrypt(req.body.message, "database"),
        readBy: [new mongoose.Types.ObjectId(userId)],
      })

      // Enregistrer le chat dans la base de données
      const savedChat = await chat.save()

      // Mettre à jour la conversation en ajoutant ce nouveau chat au tableau `chats`
      const conversaton = await ConversationModel.findByIdAndUpdate(
        req.params.id,
        { $push: { chats: savedChat._id } },
        { new: true, upsert: true }
      )

      await Promise.all([
        fetch(`${protocol()}://${SERVICES[process.env.NODE_ENV][Services.socket].domain}:${SERVICES[process.env.NODE_ENV][Services.socket].port}/`, {
          method: Method.post,
          headers: headers(req.headers["user-agent"]),
          body: JSON.stringify({
            access_token: req.body.access_token,
            receiver: conversaton.members[0],
            data: {
              _id: savedChat._id,
              message: req.body.message,
              readBy: savedChat.readBy,
              isOwnedByUser: savedChat.sender.equals(conversaton.members[0])
            },
            event: SocketKeywords.newMessage
          })
        }),
        fetch(`${protocol()}://${SERVICES[process.env.NODE_ENV][Services.socket].domain}:${SERVICES[process.env.NODE_ENV][Services.socket].port}/`, {
          method: Method.post,
          headers: headers(req.headers["user-agent"]),
          body: JSON.stringify({
            access_token: req.body.access_token,
            receiver: conversaton.members[1],
            data: {
              _id: savedChat._id,
              message: req.body.message,
              readBy: savedChat.readBy,
              isOwnedByUser: savedChat.sender.equals(conversaton.members[1])
            },
            event: SocketKeywords.newMessage
          })
        })
      ])

      return res.status(200).json({
        message: "Message enregistré avec succèss",
      })

    } catch (error) {
      console.error('Failed to add chat or update conversation:', error);
      return res.status(401).json({
        error: "Failed to add chat or update conversation",
      });
    }

  };

  public readonly updateChat = async (req: Request, res: Response): Promise<Response> => {

    try {
      const userId = await JWTUtils.getUserFromToken(req.body.access_token, req.headers['user-agent'], Tokens.accessToken)

      const chats = await ChatModel.updateMany(
        { conversation: req.params.id, readBy: { $ne: userId } },
        { $push: { readBy: userId } }
      )

      return res.status(200).json({
        message: "Message modifié avec succèss",
      })

    } catch (error) {
      console.log(error)
      return res.status(401).json({
        error: "Impossible de mettre à jour les messages",
      });
    }



    return null

  };


}
