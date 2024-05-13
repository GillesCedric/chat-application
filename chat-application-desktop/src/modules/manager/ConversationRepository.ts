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
        console.log(response.message);
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
        console.log(response.message);
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
}
