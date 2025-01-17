/**
*
*Ce code définit une classe ConversationRepository qui agit comme une couche d'abstraction pour interagir avec les conversations et les messages. Les méthodes statiques fournies permettent de récupérer les conversations d'un utilisateur, d'ajouter un message à une conversation spécifique et de charger toutes les conversations. Ces méthodes utilisent les méthodes correspondantes de la classe API pour effectuer des requêtes HTTP vers l'API distante. Des gestionnaires d'erreurs sont inclus pour traiter les réponses de l'API et fournir des messages d'erreur appropriés en cas d'échec.
 * @module modules/manager/ConversationRepository
 */
import API from "../api/API";

export type ConversationModel = {
  _id: string;
  lastMessage: {
    date: string;
    message: string;
  };
  unreadCount: number;
  fullname: string;
  picture: string;
  status: string;
  encryptedKey: string;
  decryptedKey: string;
};

export type MessageModel = {
_id: string;
  sender: string;
  message: string;
  status: string;
  createdAt: string;
  isOwnedByUser: boolean;
};
export default class ConversationRepository {
  public static async getUserConversation(id: string): Promise<any> {
    try {
      const response = await API.getUserConversation(id);
      if (response.message) {
        return { data: response.data };
      } else {
        return { error: response.errors ? response.errors : response.error };
      }
    } catch (error) {
      console.error("Failed to load conversation", error);
      return { error: "Failed to load conversation" };
    }
  }
  public static async getConversations(): Promise<any> {
    const response = await API.getUserConversations();
    if (response.message) {
      return {
        data: response.data,
      };
    }
    if (response.error) {
      console.error("Failed to load conversations:", response.error);
      return { error: response.error };
    } else if (response.errors) {
      const errors: any[] = response.errors;
      const finalError: any[] = [];
      errors.forEach((error) => {
        finalError.push(error.msg + " for " + error.path, "error");
      });
      console.log(
        finalError.reduce(
          (accumulation: [], current: []) => accumulation + " " + current,
          ""
        )
      );
      return { error: "Failed to load conversations:" };
    }
  }
  public static async addMessage(
    id: string,
    data: {
      message: string;
      _csrf: string;
    }
  ): Promise<any> {
    try {
      const response = await API.sendMessage(id, data, {
        "csrf-token": data._csrf,
      });
      if (response.message) {
       /*  console.log(response.message); */
        return {
          message: response.message,
        };
      } else if (response.error) {
        console.error("Failed to add message :", response.error);
        return { error: response.error };
      } else if (response.errors) {
        console.log("Errors : " + response.errros);
        return { error: "Failed to send message" };
      }
    } catch (error) {
      console.error("Failed to send message", error);
      return { error: error };
    }
  }
  public static async updateChat(id: string, csrfToken: string): Promise<any> {
    try {
      const response = await API.updateChat(
        id,
        {
          _csrf: csrfToken,
        },
        {
          "csrf-token": csrfToken,
        }
      );/*  console.log(response); */
      if (response.message) {
        /* console.log(response.message); */
        return {
          message: response.message,
        };
      } else if (response.error) {
        console.error("Failed to update chat :", response.error);
        return { error: response.error };
      } else if (response.errors) {
        console.log("Errors : " + response.errros);
        return { error: "Failed to update chat" };
      }
    } catch (error) {
      console.error("Failed to update chat", error);
      return { error: error };
    }
  }
}
