import { UserModel } from "../../../schemas/UserModel";
import { Request, Response } from "express";
import bcrypt from "bcrypt";
import JWTUtils from "../../security/modules/jwt/JWT";
import { Crypto } from "../../../../../chat-application-client/src/modules/crypto/Crypto";


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
      .catch((error) => {
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
        .catch((error) => {
          console.log(error);
          return res.status(500).json({
            error: "User verification impossible",
          });
        });
    }
  };

  public readonly signUp = (req: Request, res: Response): Response => {
    {
      //const body = JSON.parse(req.body.body)
      console.log(req.body)
      if (!req.body.firstname || !req.body.lastname || !req.body.username || !req.body.tel || !req.body.email || !req.body.password) {
        return res.status(422).json({
          error: "Missing parameters",
        });
      }

      const firstname = Crypto.encrypt(req.body.username, 'database');
      const lastname = Crypto.encrypt(req.body.lastname, 'database');
      const username = Crypto.encrypt(req.body.username, 'database');
      const tel = Crypto.encrypt(req.body.tel, 'database');
      const email = Crypto.encrypt(req.body.email, 'database');
      const password = Crypto.encrypt(bcrypt.hashSync(req.body.password, process.env.SALT), 'database');

      try {
        UserModel.insertMany({
          lastname: lastname,
          firstname: firstname,
          username: username,
          email: email,
          password: password,
          isVerified: false,
          friends: []
        })
        return res.status(200).json({
          message: "success",
        });
      } catch (error) {
        return res.status(401).json({
          error: error,
        });
      }

    }
  };
}
