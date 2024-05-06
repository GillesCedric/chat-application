import * as jwt from "jsonwebtoken";
import { userLogger } from "modules/logger/Logger";

export type TokenType = "access_token" | "refresh_token"

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

  public static readonly generateTokenForUser: (id: string | number, userAgent: string, tokenType: TokenType) => string = (id: string, userAgent: string, tokenType: TokenType): string => {
    return jwt.sign({ userId: id, userAgent: userAgent }, tokenType == "access_token" ? process.env.ACCESS_TOKEN_ENCRYPTION_KEY : process.env.REFRESH_TOKEN_ENCRYPTION_KEY, { expiresIn: tokenType == "access_token" ? process.env.ACCESS_TOKEN_DELAY : process.env.REFRESH_TOKEN_DELAY })
  }

  public static readonly generateTokenWithData: (data: any) => string = (data: any): string => {
    return jwt.sign(data, process.env.VERIFY_EMAIL_TOKEN_ENCRYPTION_KEY, { expiresIn: process.env.VERIFY_EMAIL_TOKEN_DELAY })
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
  public static readonly getUserFromToken: (token: string, userAgent: string, tokenType: TokenType) => string | undefined = (
    token: string,
    userAgent: string,
    tokenType: TokenType
  ): string | undefined => {
    token = this.parseToken(token)
    let userId = undefined;
    try {
      const jwtToken = jwt.verify(token, tokenType == "access_token" ? process.env.ACCESS_TOKEN_ENCRYPTION_KEY : process.env.REFRESH_TOKEN_ENCRYPTION_KEY);

      //@ts-ignore
      if (jwtToken && jwtToken.userAgent as unknown as string == userAgent) {
        //@ts-ignore
        userId = jwtToken.userId as unknown as number;
      }

    } catch (error) {
      console.log(error);
    }
    return userId;
  };

  public static readonly getDataFromToken: (token: string) => any | undefined = (
    token: string): string | undefined => {

    let data = undefined;

    try {
      const jwtToken = jwt.verify(token, process.env.VERIFY_EMAIL_TOKEN_ENCRYPTION_KEY);

      if (jwtToken) {
        //@ts-ignore
        data = jwtToken
      }

    } catch (error) {
      console.log(error);
    }
    return data;
  };

}
