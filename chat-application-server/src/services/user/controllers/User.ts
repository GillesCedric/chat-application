import { UserModel } from "../../../schemas/UserModel";
import { Request, Response } from "express";
import bcrypt from "bcrypt";
import JWTUtils from "../../../modules/jwt/JWT";
import { Crypto } from "../../../modules/crypto/Crypto";
import { Code } from "../../../utils/HTTP";


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

  public readonly me = (req: Request, res: Response): Response => {

    const token = req.session['token']
    const userId = req.body.id;
    try {
      UserModel.findById(userId)
        .then((user) => {
          return res.status(200).json({
            user,
          })
        })
        .catch((error) => {
          console.log(error);
          return res.status(500).json({
            error: "Impossible de récupérer les informations",
          });
        })
    } catch (error) {
      console.log(error);
      return res.status(500).json({
        error: "Erreur lors de la vérification des informations",
      });
    }

  };
  public readonly signIn = (req: Request, res: Response): Response => {
    const email = req.body.email;
    const password = req.body.password;
    try {
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
          
          return res.status(200).json({
            message: 'connection success',
            token: JWTUtils.generateTokenForUser(userFound.id)
          });
        })
        .catch(error => {
          console.log(error);
          return res.status(500).json({
            error: "Cet utilisateur n'existe pas",
          });
        })
    } catch (error) {
      console.log(error);
      return res.status(500).json({
        error: "User verification impossible",
      });
    }

  };

  public readonly signUp = (req: Request, res: Response): Response => {

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
        .then(user => {
          return res.status(200).json({
            message: "success",
          });
        })
        .catch(error => {
          //TODO log the error
          return res.status(401).json({
            error: "Cet utilisateur existe déjà",
          });
        })
    } catch (error) {
      //TODO log the error
      return res.status(401).json({
        error: "Impossible d'enregistrer l'utilisateur",
      });
    }
  };
}
