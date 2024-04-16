import { Request, Response } from "express";
import JWTUtils from "../../../modules/jwt/JWT";
import { Crypto } from "../../../modules/crypto/Crypto";
import { Code } from "../../../utils/HTTP";
import { Tokens } from "../../../utils/Keywords";
import Socket from "../Socket";


export default class SocketController {

  public readonly emit = async (req: Request, res: Response): Promise<Response> => {
    try {
      const userId = JWTUtils.getUserFromToken(req.body.access_token, Tokens.accessToken)

      Socket.socket

      

    } catch (error) {
      return res.status(422).json({
        error: "Impossible de récupérer les notifications",
      });
    }

  };

}
