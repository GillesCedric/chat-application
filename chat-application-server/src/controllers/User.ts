import { UserModel } from "../models/User";
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
  public readonly getAll = (req: Request, res: Response): Response => {
    if (UserModel.find({}) === null) {
      return res.status(422).json(null);
    }
    UserModel.find({}).then((users) => {
      return res.status(200).json({
        users,
      });
    });
  };

  public readonly getUserFriends = (req: Request, res: Response): Response => {
    if (undefined === req.body.userId) {
      return res.status(422).json({
        error: "Missing parameters",
      });
    }
    const friends = [];
    const userId = req.body.userId;

    UserModel.findById(userId)
      .then((user) => {
        if (!user) {
          return res.status(404).json({ error: "User not found" });
        }
        var friendsId = user.friends;
        UserModel.find({ _id: { $in: friendsId } }).then((friends) => {
          // console.log(friends);
          return res.status(200).json({
            frineds: friends,
          });
        });
      })
      .catch((error: any) => {
        console.error(error);
        return res.status(500).json({ error: "Internal Server Error" });
      });
  };

  public readonly get = (req: Request, res: Response): Response => {
    console.log(req.baseUrl);
    if (req.body.id === undefined) {
      return res.status(422).json({
        error: "Missing parameters.",
      });
    }
    const userId = req.body.id;
    UserModel.findById(userId).then((user) => {
      return res.status(200).json({
        user,
      });
    });
  };
  public readonly login = (req: Request, res: Response): Response => {
    {
      if (!req.body.username || !req.body.password) {
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
          const passwordMatches = bcrypt.compare(password, userFound.password);

          if (!passwordMatches) {
            console.log("Incorrect password");
            return res.status(401).json({
              error: "Incorrect password",
              data: password + userFound.password + " " + passwordMatches,
            });
          }
          // If credentials are correct, return the desired response
          return res.status(200).json({
            userId: userFound.id,
            token: JWTUtils.generateTokenForUser(userFound.id),
          });
        })
        .catch((error: any) => {
          console.log(error);
          return res.status(500).json({
            error: "User verification impossible",
          });
        });
    }
  };
}
