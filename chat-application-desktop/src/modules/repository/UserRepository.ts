import API from "../api/API";

export default class UserRepository {
  public static async register(userData: {
    firstname: string;
    lastname: string;
    username: string;
    email: string;
    password: string;
    tel: string;
  }): Promise<any> {
    try {
      const response = await API.register({
        firstname: userData.firstname,
        lastname: userData.lastname,
        username: userData.username,
        email: userData.email,
        password: userData.password,
        tel: userData.tel,
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
  }): Promise<any> {
    try {
      const response = await API.sendFriendRequest({
        username: data.username,
        comment: data.comment,
      });
      if (response.message) {
        console.log(response.message);
        return {
          message: data.username + " successfully added to your friends",
        };
      }
      if (response.error) {
        console.error(
          "Failed to add friend with error message:",
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
        return { error: "Username does not exist" };
      }
    } catch (error) {
      console.error("Error while adding friend", error);
      return { error: error };
    }
  }

  public static async updateFriendRequest( id : string , data :any): Promise<any> {
    try {
      const response = await API.updateFriendRequest(id , data);
      if (response.message) {
        console.log(response.message);
        return {
          message:"Request successfully accpeted",
        };
      }
      if (response.error) {
        console.error(
          "Failed to update friend request:",
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
        return { error: "Username does not exist" };
      }
    } catch (error) {
      console.error(          "Failed to update friend request:",
, error);
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
