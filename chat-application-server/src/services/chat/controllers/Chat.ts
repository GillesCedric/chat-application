import { ConversationModel } from "../../../models/Conversation";
import { ChatModel, ChatStatus } from "../../../models/Chat";
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

      const userId = JWTUtils.getUserFromToken(req.body.access_token, Tokens.accessToken)

      if (await this.checkIfConversationExists(req.body.members)) {
        return res.status(401).json({
          error: "Cette conversation existe déjà",
        });
      }

      const conversation = new ConversationModel({ members: req.body.members.sort((a: mongoose.Types.ObjectId, b: mongoose.Types.ObjectId) => a.toString().localeCompare(b.toString())) });

      const savedConversation = await conversation.save()

      const otherMember = await UserModel.findById(savedConversation.members.find(id => !id.equals(userId)))

      await fetch(`${protocol()}://${SERVICES[process.env.NODE_ENV][Services.socket].domain}:${SERVICES[process.env.NODE_ENV][Services.socket].port}/`, {
        method: Method.post,
        headers: headers(),
        body: JSON.stringify({
          access_token: req.body.access_token,
          receivers: req.body.members,
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

    const userId = JWTUtils.getUserFromToken(req.body.access_token, Tokens.accessToken)

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
        chats: chats.map(chat => ({
          _id: chat._id,
          sender: chat.sender,
          message: Crypto.decrypt(chat.message, "database"),
          status: Crypto.decrypt(chat.status, "status"),
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

      const userId = JWTUtils.getUserFromToken(req.body.access_token, Tokens.accessToken)

      let conversations = await ConversationModel.aggregate([
        // Étape 1: Trouver toutes les conversations impliquant l'utilisateur
        {
          $match: {
            members: new mongoose.Types.ObjectId(userId)
          }
        },
        // Étape 2: Joindre avec la collection 'Chats'
        {
          $lookup: {
            from: 'chats', // Le nom de la collection de chats dans MongoDB
            localField: '_id',
            foreignField: 'conversation',
            as: 'chats'
          }
        },
        // Étape 3: Ajouter des champs pour le dernier message et le nombre de messages non lus
        {
          $addFields: {
            lastMessageDate: { $max: "$chats.createdAt" },
            lastMessageDetails: {
              $first: {
                $arrayElemAt: [
                  {
                    $filter: {
                      input: { $slice: [{ $sortArray: { input: "$chats", sortBy: { createdAt: -1 } } }, 1] },
                      as: "chat",
                      cond: {
                        $and: [
                          { $eq: ["$$chat.status", Crypto.encrypt(ChatStatus.received, "status")] },
                          { $ne: ["$$chat.deleted", Crypto.encrypt("true", "boolean")] }
                        ]
                      }
                    }
                  },
                  0
                ]
              }
            },
            unreadCount: {
              $size: {
                $filter: {
                  input: "$chats",
                  as: "chat",
                  cond: {
                    $and: [
                      { $eq: ["$$chat.status", Crypto.encrypt(ChatStatus.received, "status")] }, // Filtrer pour le statut 'RECEIVED'
                      { $ne: ["$$chat.deleted", Crypto.encrypt("true", "boolean")] }      // Assurer que le message n'est pas supprimé
                    ]
                  }
                }
              }
            }
          }
        },
        // Étape 4: Joindre avec la collection 'Users' pour obtenir les détails des membres
        {
          $lookup: {
            from: 'users',
            let: { memberList: "$members" },
            pipeline: [
              {
                $match: {
                  $expr: {
                    $and: [
                      { $in: ["$_id", "$$memberList"] },
                      { $ne: ["$_id", new mongoose.Types.ObjectId(userId)] } // Exclure l'utilisateur actuel
                    ]
                  }
                }
              },
              {
                $project: {
                  _id: 1,
                  username: 1,
                  picture: 1,
                  status: 1
                }
              }
            ],
            as: 'membersDetails'
          }
        },
        // Étape 5: Projeter les champs nécessaires
        {
          $project: {
            lastMessageDate: 1,
            lastMessageDetails: 1,
            unreadCount: 1,
            membersDetails: 1
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
        return {
          _id: conversation._id,
          lastMessageDate: conversation.lastMessageDate,
          lastMessageDetails: conversation.lastMessageDetails && Crypto.decrypt(conversation.lastMessageDetails, "database"),
          unreadCount: conversation.unreadCount,
          userId: conversation.membersDetails[0]._id,
          username: Crypto.decrypt(conversation.membersDetails[0].username, "username"),
          picture: Crypto.decrypt(conversation.membersDetails[0].picture, "database"),
          status: Crypto.decrypt(conversation.membersDetails[0].status, "status"),
        };
      });


      return res.status(200).json({
        conversations,
      })

    } catch (error) {
      console.log(error)
      return res.status(401).json({
        error: "Impossible de récupérer la liste des conversations",
      });
    }

  };

  public readonly addChats = async (req: Request, res: Response): Promise<Response> => {

    const userId = JWTUtils.getUserFromToken(req.body.access_token, Tokens.accessToken)

    try {
      // Créer un nouvel objet chat
      const chat = new ChatModel({
        conversation: new mongoose.Types.ObjectId(req.params.id),
        sender: new mongoose.Types.ObjectId(userId),
        message: Crypto.encrypt(req.body.message, "database"),
        status: Crypto.encrypt(ChatStatus.received, "status"),
        deleted: Crypto.encrypt("false", "boolean")
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
          headers: headers(),
          body: JSON.stringify({
            access_token: req.body.access_token,
            receivers: conversaton.members[0],
            data: {
              _id: savedChat._id,
              message: req.body.message,
              status: ChatStatus.received,
              isOwnedByUser: savedChat.sender.toString() === userId
            },
            event: SocketKeywords.newMessage
          })
        }),
        fetch(`${protocol()}://${SERVICES[process.env.NODE_ENV][Services.socket].domain}:${SERVICES[process.env.NODE_ENV][Services.socket].port}/`, {
          method: Method.post,
          headers: headers(),
          body: JSON.stringify({
            access_token: req.body.access_token,
            receivers: conversaton.members[1],
            data: {
              _id: savedChat._id,
              message: req.body.message,
              status: ChatStatus.received,
              isOwnedByUser: savedChat.sender.toString() === userId
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
      throw error;
    }

  };

  public readonly updateChat = async (req: Request, res: Response): Promise<Response> => {

    const userId = JWTUtils.getUserFromToken(req.body.access_token, Tokens.accessToken)

    try {
      // Créer un nouvel objet chat
      const chat = new ChatModel({
        conversation: new mongoose.Types.ObjectId(req.params.id),
        sender: new mongoose.Types.ObjectId(userId),
        message: Crypto.encrypt(req.body.message, "database"),
        status: Crypto.encrypt(ChatStatus.received, "status"),
        deleted: Crypto.encrypt("false", "boolean")
      })

      // Enregistrer le chat dans la base de données
      const savedChat = await chat.save()

      // Mettre à jour la conversation en ajoutant ce nouveau chat au tableau `chats`
      const conversaton = await ConversationModel.findByIdAndUpdate(
        req.params.id,
        { $push: { chats: savedChat._id } },
        { new: true, upsert: true }
      )

      await fetch(`${protocol()}://${SERVICES[process.env.NODE_ENV][Services.socket].domain}:${SERVICES[process.env.NODE_ENV][Services.socket].port}/`, {
        method: Method.post,
        headers: headers(),
        body: JSON.stringify({
          access_token: req.body.access_token,
          receivers: conversaton.members,
          data: {
            _id: savedChat._id,
            message: req.body.message,
            status: ChatStatus.received,
            isOwnedByUser: savedChat.sender.toString() === userId
          },
          event: SocketKeywords.newMessage
        })
      })

      return res.status(200).json({
        message: "Message enregistré avec succèss",
      })

    } catch (error) {
      console.error('Failed to add chat or update conversation:', error);
      throw error;
    }

  };


}
