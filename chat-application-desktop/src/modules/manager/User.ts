import API from "../api/API";

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
}
