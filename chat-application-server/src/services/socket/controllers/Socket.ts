import { Request, Response } from "express";
import JWTUtils from "../../../modules/jwt/JWT";
import { Crypto } from "../../../modules/crypto/Crypto";
import { Code } from "../../../utils/HTTP";
import { SocketKeywords, Tokens } from "../../../utils/Keywords";
import Socket from "../Socket"


export default class SocketController {
  public readonly sendEventToUser = async (req: Request, res: Response): Promise<Response> => {
    console.log("received")
    req.body.receivers.forEach((receiver: string) => { 
      Socket.sendEventToUser(receiver, req.body.data, req.body.event)
    })

    return res.status(Code.okay).json({
      message: "Evènement envoyé avec succèss",
    })

  }

}
