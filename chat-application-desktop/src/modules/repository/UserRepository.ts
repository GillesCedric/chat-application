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
        return finalError.reduce(
          (accumulation: [], current: []) => accumulation + " " + current,
          ""
        );
      }
    } catch (error) {
      console.error("Error in registration:", error);
      return false;
    }
  }
  public static async checkUnique(data: any) {
    const response = await API.checkIfExist(data);
    console.log(response);
  }
}
