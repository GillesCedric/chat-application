import { UserModel } from "../../../schemas/UserModel";
import { Request, Response } from "express";
import bcrypt from "bcrypt";
import JWTUtils from "../../security/modules/jwt/JWT";
import { Crypto } from "../../../utils/crypto/Crypto";


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
      if (!req.body.email || !req.body.password) {
        return res.status(422).json({
          error: "Missing parameters",
        });
      }

      const email = req.body.email;
      const password = req.body.password;

      UserModel.findOne({ email: Crypto.encrypt(email, 'email') })
        .then((userFound) => {
          if (!userFound) {
            return res.status(401).json({
              error: "Incorrect email",
            });
          }

          const passwordMatches = bcrypt.compareSync(password, userFound.password);

          if (!passwordMatches) {
            return res.status(401).json({
              error: "Incorrect password",
            })
          }
          // If credentials are correct, return the desired response
          req.session['token'] = JWTUtils.generateTokenForUser(userFound.id)
          return res.status(200).json({
            message: 'connection established 2'
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
      if (!req.body.firstname || !req.body.lastname || !req.body.username || !req.body.tel || !req.body.email || !req.body.password) {
        return res.status(422).json({
          error: "Missing parameters",
        });
      }

      //salt should always be in number for because bcrypt generate salt only for salt in number not string
      const firstname = Crypto.encrypt(req.body.firstname, 'database')
      const lastname = Crypto.encrypt(req.body.lastname, 'database')
      const username = Crypto.encrypt(req.body.username, 'username')
      const tel = Crypto.encrypt(req.body.tel, 'tel')
      const email = Crypto.encrypt(req.body.email, 'email')
      const password = bcrypt.hashSync(req.body.password, Number.parseInt(process.env.SALT_ROUNDS))
      const isVerified = Crypto.encrypt('false', 'database')

      try {
        UserModel.insertMany({
          lastname: lastname,
          firstname: firstname,
          username: username,
          tel: tel,
          email: email,
          password: password,
          isVerified: isVerified,
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
