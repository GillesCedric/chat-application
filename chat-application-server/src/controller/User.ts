import { User } from "schemaModels/User";
import { Request, Response } from "express";
import * as async from "async";
import * as bcrypt from "bcrypt";
import JWTUtils from "utils/JWTUtils";
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
          })
            .then((userFound) => {
              done(null, userFound);
            })
            .catch((error) => {
              console.log(error);
              return res.status(500).json({
                error: "User verfication impossible",
              });
            });
        },
        (userFound: User, done: any) => {
          if (!userFound) {
            return res.status(401).json({
              error: "Incorrect username",
            });
          }
          bcrypt.compare(
            password,
            userFound.password,
            (error: Error, result: boolean) => {
              console.log(error);
              done(null, userFound, result);
            }
          );
        },
        (userFound: User, result: boolean, done: any) => {
          if (!result) {
            console.log("Incorrect password");
            return res.status(401).json({
              error: "Incorrect password",
            });
          }
          done(userFound);
        },
        (userFound: User, done: any) => {
          return res.status(200).json({
            userId: userFound.id,
            token: JWTUtils.generateTokenForUser(userFound),
          });
        },
      ]);
    }
  };
}
