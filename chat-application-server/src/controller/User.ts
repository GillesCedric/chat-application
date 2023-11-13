import { User } from "schemaModels/UserModel";
import { Request, Response } from "express";
import * as bcrypt from "bcrypt";
import JWTUtils from "../modules/jwt/JWT";
import async from "async";
/**
 * @class UserController
 * @description this class is used to handle the request from the User endpoint
 * @author Jean-Loan BATCHO
 * @returns {Response}
 */

export default class UserController {
  public readonly getAll = (req: Request, res: Response): Response => {
    User.find({})
      .then((users) => {
        var userMap = [];
        users.forEach((user) => {
          userMap[user.id] = user;
        });
        return res.status(200).json({
          userMap: userMap,
        });
      })
      .catch((error) => {
        console.log(error);
        return res.status(500).json({
          error: "Error getting all users.",
        });
      });
      return res.status(500).json({
        error: "Error getting all users.",
      });
  };

  public readonly get = (req: Request , res: Response) :Response =>{
    if(req.body.id === null){
      return res.status(422).json({
        error: "Missing parameters."
      })
    }
    const userId = req.body.id;
    User.findById(userId)
    .then(
      (user) => {
        var use = new UserModel(user.lastname , )
      }
    )
    
  }
  public readonly login = (req: Request, res: Response): Response => {
    {
      if (req.body.username === null || req.body.password === null) {
        return res.status(422).json({
          error: "Missing parameters",
        });
      }

      const username = req.body.username;
      const password = req.body.password;

      async.waterfall([
        (done: any) => {
          User.findOne(
            { username: username },
          )
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
        (userFound: UserModel, done: any) => {
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
        (userFound: UserModel, result: boolean, done: any) => {
          if (!result) {
            console.log("Incorrect password");
            return res.status(401).json({
              error: "Incorrect password",
            });
          }
          done(userFound);
        },
        (userFound: UserModel, done: any) => {
          return res.status(200).json({
            userId: userFound.id,
            token: JWTUtils.generateTokenForUser(userFound.id),
          });
        },
      ]);
    }
  };
}
