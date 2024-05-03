import API from "../api/API";

export default class NotificationRepository {
  public static async getNotifications(data: any): Promise<any> {
    try {
      const response = await API.getNotifications({
        userId: data.userId,
      });
      if (response.message) {
        console.log("Notifications successfully loaded ");
        return { message: response.message };
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
}