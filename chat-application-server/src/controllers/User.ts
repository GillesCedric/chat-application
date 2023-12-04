import { UserModel } from "../schemas/UserModel";
import { Request, Response } from "express";
import * as bcrypt from "bcrypt";
import JWTUtils from "../modules/jwt/JWT";
/**
 * @class UserController
 * @description this class is used to handle the request from the User endpoint
 * @author Jean-Loan BATCHO
 * @returns {Response}
 */

export default class UserController {
  public readonly getAll = (req:Request , res: Response): Response => {
    if (UserModel.find({}) === null) {
      return res.status(422).json([]);
    }
    UserModel.find({}).then((users) => {
      return res.status(200).json({
          users
      });
    });
  };

  public readonly get = (req: Request, res: Response): Response => {
    if (req.body.id == null) {
      return res.status(422).json({
        error: "Missing parameters.",
      });
    }
    const userId = req.body.id;
    UserModel.findById(userId).then((user) => {
      return res.status(200).json({
        user
      });
    });
  };
  public readonly login = (req: Request, res: Response): Response => {
    {
      if (req.body.username === null || req.body.password === null) {
        return res.status(422).json({
          error: "Missing parameters",
        });
      }

      const username = req.body.username;
      const password = req.body.password;

      UserModel.findOne({ username: username })
        .then((userFound) => {
          if (!userFound) {
            return res.status(401).json({
              error: "Incorrect username",
            });
          }
          console.log( bcrypt.compare(
            password,
            userFound.password))
          bcrypt.compare(
            password,
            userFound.password,
            (error: Error, result: boolean) => {
              console.log(error);
              if (!result) {
                console.log("Incorrect password");
                return res.status(401).json({
                  error: "Incorrect password",
                });
              }
              return res.status(200).json({
                userId: userFound.id,
                token: JWTUtils.generateTokenForUser(userFound.id),
              });
            }
          );
        })
        .catch((error) => {
          console.log(error);
          return res.status(500).json({
            error: "User verfication impossible",
          });
        });
    }
  };
}
