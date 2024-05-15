/**
*
*Ce code définit une classe User qui encapsule les fonctionnalités liées à un utilisateur, telles que l'enregistrement, l'envoi de demandes d'amis, la mise à jour des demandes d'amis et la récupération des demandes d'amis. Les méthodes statiques fournies effectuent des opérations asynchrones en utilisant les méthodes correspondantes de la classe API pour interagir avec l'API distante. Des gestionnaires d'erreurs sont inclus pour gérer les réponses de l'API et fournir des messages d'erreur appropriés en cas d'échec.
 * @module modules/manager/User
 */
import API from "../api/API";
export type UserModel = {
  lastname: string;
  firstname: string;
  username: string;
  tel: string;
  email: string;
  isEmailVerified: string;
  isTelVerified: string;
  is2FAEnabled: string;
  picture: string;
  status: string;
};
export default class User {
  public static async register(userData: {
    firstname: string;
    lastname: string;
    username: string;
    email: string;
    password: string;
    tel: string;
    picture: string;
    _csrf: string;
  }): Promise<any> {
    try {
      const response = await API.register(userData, {
        "csrf-token": userData._csrf,
      });
      if (response.message) {
        console.log("Registration successful");
        return { message: userData.username + " registration successful" };
      }
      if (response.error) {
        console.error(
          "Registration failed with error message:",
          response.error
        );
        return { error: response.error };
      } else if (response.errors) {
        const errors: any[] = response.errors;
        const finalError: any[] = [];
        errors.forEach((error) => {
          finalError.push(error.msg + " for " + error.path, "error");
        });
        return {
          error: finalError.reduce(
            (accumulation: [], current: []) => accumulation + " " + current,
            ""
          ),
        };
      }
    } catch (error) {
      console.error("Error in registration:", error);
      return { error: error };
    }
  }
  public static async checkUnique(data: any) {
    const response = await API.checkIfExist(data);
    console.log(response);
  }
  public static async sendFriendRequest(data: {
    username: string;
    comment: string;
    _csrf: string;
  }): Promise<any> {
    try {
      const response = await API.sendFriendRequest(data, {
        "csrf-token": data._csrf,
      });
      if (response.message) {
        console.log(response.message);
        return {
          message: "Friend requests successfully sent to " + data.username,
        };
      } else if (response.error) {
        console.error(
          "Failed to add friend with error message:",
          response.error
        );
        return { error: response.error };
      } else if (response.errors) {
        console.log(response);
        return {
          error: "Failed to send friend request " + response.errors[0].msg,
        };
      }
    } catch (error) {
      console.error("Error while adding friend", error);
      return { error: error };
    }
  }
  public static async updateFriendRequest(
    id: string,
    data: { status: string; _csrf: string }
  ): Promise<any> {
    try {
      const response = await API.updateFriendRequest(id, data, {
        "csrf-token": data._csrf,
      });
      if (response.message) {
        console.log(response.message);
        return { message: "Request successfully accepted" };
      } else if (response.error) {
        console.error(
          "Failed to udate frined request with error message:",
          response.error
        );
        return { error: response.error };
      } else if (response.errors) {
        console.log(response.errors.msg);
        return {
          error: "Failed to update friend request " + response.errors.msg,
        };
      }
    } catch (error) {
      console.error("Failed to update friend request:", error);
      return Promise.reject(error.message || "Error updating friend request");
    }
  }
  public static async getFriendsRequests(): Promise<any> {
    try {
      const response = await API.getFriendsRequests();

      if (response.error) {
        console.error("Failed to load Friends requests :", response.error);
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
        return { error: "Failed to load Friends requests" };
      } else if (response.message) {
        return response;
      }
    } catch (error) {
      console.error("Failed to load Friends requests :", error);
      return { error: error };
    }
  }
  public static async me(): Promise<any> {
    try {
      const response = await API.me();
      if (response.error) {
        console.error("Failed to load user's data :", response.error);
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
        return { error: "Failed to load user's data" };
      } else {
/*         console.log(response);
 */        return { data: response.user };
      }
    } catch (error) {
      console.error("Failed to load user's data :", error);
      return { error: error };
    }
  }
  public static async getUsersFriends(data: {
    username: string;
  }): Promise<any> {
    try {
      const response = await API.register({
        username: data.username,
      });
      if (response.message) {
        console.log("Friend list successfully loaded.");
        return {
          message: response.message,
        };
      }
      if (response.error) {
        console.error(
          "Failed to load friend list with error message :",
          response.error
        );
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
        return { error: finalError };
      }
    } catch (error) {
      console.error("Error while loading friend list:", error);
      return { error: error };
    }
  }
  public static async signOut(data: { _csrf: string }): Promise<any> {
    try {
      const response = await API.signOut(data, {
        "csrf-token": data._csrf,
      });
      if (response.message) {
        console.log(response.message);
        return {
          message: response.message,
        };
      } else if (response.error) {
        console.error(response.error);
        return { error: response.error };
      } else if (response.errors) {
        console.log(response);
        return {
          error: "Failed to sign out " + response.errors[0].msg,
        };
      }
    } catch (error) {
      console.error("Error while adding signing out ", error);
      return { error: error };
    }
  }
  public static async verifyTel(data: { _csrf: string }): Promise<any> {
    try {
      const response = await API.verfifyTel(data, {
        "csrf-token": data._csrf,
      });
      if (response.message) {
        console.log(response.message);
        return {
          message: response.message,
        };
      } else if (response.error) {
        console.error(response.error);
        return { error: response.error };
      } else if (response.errors) {
        console.log(response);
        return {
          error: "Failed to send sms " + response.errors[0].msg,
        };
      }
    } catch (error) {
      console.error("Error while sending sms ", error);
      return { error: error };
    }
  }
  public static async checkCodeTel(data: {
    _csrf: string;
    code: string;
  }): Promise<any> {
    try {
      const response = await API.checkCodeTel(data, {
        "csrf-token": data._csrf,
      });
      if (response.message) {
/*         console.log(response.message);
 */        return {
          message: response.message,
        };
      } else if (response.error) {
        console.error(response.error);
        return { error: response.error };
      } else if (response.errors) {
        console.log(response);
        return {
          error: +response.errors[0].msg,
        };
      }
    } catch (error) {
      console.error("Error while verifying code ", error);
      return { error: error };
    }
  }
  public static async updateProfile(data: any): Promise<any> {
    try {
      const response = await API.updateProfile(data, {
        "csrf-token": data._csrf,
      });
      console.log(response);
      if (response.message) {
        return {
          message: response.message,
        };
      } else if (response.error) {
        console.error(
          "Failed to update user info:",
          response.error
        );
        return { error: response.error };
      } else if (response.errors) {
        console.log(response);
        return {
          error: "Failed to update user info " + response.errors[0].msg,
        };
      }
    } catch (error) {
      console.error("Error while updating user info", error);
      return { error: error };
    }
  }
}
