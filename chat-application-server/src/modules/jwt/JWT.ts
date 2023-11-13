import User from "schemaModels/UserModel";
import * as jwt from "jsonwebtoken";

/**
 * @class JWTUtils
 * @author Gilles Cédric
 * @description this class is used to handle oll the JsonWebToken operations
 * @abstract
 * @exports
 * @default
 * @since 22/05/2022
 */
export default abstract class JWTUtils {
  /**
   * @method generateTokenForUser
   * @description this method is used to generate and sign a token for a specific user
<<<<<<< HEAD:chat-application-server/src/utils/JWTUtils.ts
<<<<<<< HEAD
   * @param {User} user the user
=======
	 * @param {string} id the user id
>>>>>>> 8aed3ad3a7a2c5547b6d516fbe78001a97f485ac
=======
	 * @param {string} id the user id
>>>>>>> 61faf41140fb10ab0cb29c72231596f2d97f42e5:chat-application-server/src/modules/jwt/JWT.ts
   * @readonly
   * @static
   * @private
   * @returns {string} the generated token
	 */
	public static readonly generateTokenForUser: (id: string) => string = (id: string): string => {
		return jwt.sign({ userId: id }, process.env.TOKEN_ENCRYPTION_KEY, { expiresIn: process.env.TOKEN_DELAY })
	}

  /**
   * @method parseToken
   * @description this method is used to parse a given token
   * @readonly
   * @static
   * @private
   * @returns {string}
   */
  public static readonly parseToken: (token: string) => string = (
    token: string
  ): string => {
    return token.replace("Bearer ", "");
  };

  /**
   * @method getUserFromToken
   * @description this method is used to get a specific userId from a given token
   * @readonly
   * @static
   * @private
   * @returns {number}
   */
  public static readonly getUserFromToken: (token: string) => number = (
    token: string
  ): number => {
    token = this.parseToken(token);
    let userId = -1;
    try {
      const jwtToken = jwt.verify(token, process.env.TOKEN_ENCRYPTION_KEY);
      //@ts-ignore
      userId = jwtToken.userId as unknown as number;
    } catch (error) {
      console.log(error);
    }
    return userId;
  };
}
