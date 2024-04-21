import API from "../api/API";

export default class ChatRepository {

  public static async sendMessage(data: any):Promise<any> {
		try {
      const response = await API.register({
				senderId: data.senderId, 
				receiverId: data.receiverId,
				message: data.message, 
				timeStamp: data.timeStamp,
      });
      if (response.message) {
        console.log("Message : successfully sent " +response.message);
        return { message: "Message successfully sent" };
      }
      if (response.error) {
        console.error(
          "Sending failed with error message:",
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
          )
        };
      }
    } catch (error) {
      console.error("Error in sending of message :", error);
      return {error : error};
    }
  }
}
