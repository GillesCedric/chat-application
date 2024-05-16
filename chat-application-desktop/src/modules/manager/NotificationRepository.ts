import API from "../api/API";
export type NotificationModel = {
  _id: string;
  sender: string;
  receiver: string;
  content: string;
  status: string;
  createdAt: string;
  updatedAt: string;
};
export default class NotificationRepository {
  public static async getNotifications(): Promise<any> {
    try {
      const response = await API.getNotifications();
      /*       console.log(response);
       */ if (response.message) {
        /*         console.log("Notifications successfully loaded ");
         */ return { data: response.data };
      }
      if (response.error) {
        console.error(
          "Failed to load user's notifications with error message :",
          response.error
        );
        return { error: "Failed to load user's notifications" };
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
      console.error(
        "Failed to load user's notifications with error message :",
        error
      );
      return { error: error };
    }
  }
  public static async updateNotifications(
    id: string,
    data: { _csrf: string }
  ): Promise<any> {
    try {
      const response = await API.updateNotifcation(id, data, {
        "csrf-token": data._csrf, 
      });
      if (response.message) {
        return { message: response.message };
      }
      if (response.error) {
        console.error(
          "Failed to update notification with error message :",
          response.error
        );
        return { error: "Failed to lupdate notification" };
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
      console.error(
        "Failed to update notification with error message :",
        error
      );
      return { error: error };
    }
  }
}
