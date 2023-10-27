import User from "models/User";
import { Request, Response } from "express";
import * as async from "async";
/**
 * @class UserController
 * @description this class is used to handle the request from the User endpoint
 * @author Jean-Loan BATCHO
 * @returns {Response}
 */
export default class UserController {
  public readonly login: (req: Request, res: Response) => void = (
    req: Request,
    res: Response
  ): Response => {
    {
      if (req.body.username === null || req.body.password === null) {
        return res.status(500).json({
          error: "Missing parameters",
        });
      }

      const username = req.body.username;
      const password = req.body.password;

      async.waterfall([
        (done: any) => {
          User.findOne({
            where: { username: username },
          });
        },
      ]);
    }
  };
}
