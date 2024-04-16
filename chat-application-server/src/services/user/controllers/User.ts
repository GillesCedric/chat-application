import { UserModel } from "../../../models/User";
import { FriendsRequestModel } from "../../../models/FriendsRequest";
import { Request, Response } from "express";
import bcrypt from "bcrypt";
import JWTUtils from "../../../modules/jwt/JWT";
import { Crypto } from "../../../modules/crypto/Crypto";
import { Code, headers, protocol } from "../../../utils/HTTP";
import { Services, Tokens } from "../../../utils/Keywords";
import SERVICES from '../../../config/services.json'


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
    const token = req.session["token"];
    const userId = req.body.id;
    try {
      UserModel.findById(userId)
        .then((user) => {
          return res.status(200).json({
            user,
          });
        })
        .catch((error) => {
          console.log(error);
          return res.status(500).json({
            error: "Impossible de récupérer les informations",
          });
        });
    } catch (error) {
      console.log(error);
      return res.status(500).json({
        error: "Erreur lors de la vérification des informations",
      });
    }
  };
  public readonly signIn = async (req: Request, res: Response): Promise<Response> => {

    try {
      const user = await UserModel.findOne({ email: Crypto.encrypt(req.body.email, "email") })
      if (!user) {
        return res.status(401).json({
          error: "Incorrect email",
        });
      }

      const passwordMatches = bcrypt.compareSync(
        req.body.password,
        user.password
      );

      if (!passwordMatches) {
        return res.status(401).json({
          error: "Incorrect password",
        });
      }

      return res.status(200).json({
        message: "connection success",
        access_token: JWTUtils.generateTokenForUser(
          user.id,
          Tokens.accessToken
        ),
        refresh_token: JWTUtils.generateTokenForUser(
          user.id,
          Tokens.refreshToken
        ),
      })

    } catch (error) {
      console.log(error);
      return res.status(500).json({
        error: "Cet utilisateur n'existe pas",
      });
    }
  };

  public readonly signUp = async (req: Request, res: Response): Promise<Response> => {
    //salt should always be in number for because bcrypt generate salt only for salt in number not string

    //TODO add username, tel and email unique verification
    try {
      const user = await UserModel.insertMany({
        lastname: Crypto.encrypt(req.body.lastname, "database"),
        firstname: Crypto.encrypt(req.body.firstname, "database"),
        username: Crypto.encrypt(req.body.username, "username"),
        tel: Crypto.encrypt(req.body.tel, "tel"),
        email: Crypto.encrypt(req.body.email, "email"),
        password: bcrypt.hashSync(
          req.body.password,
          Number.parseInt(process.env.SALT_ROUNDS)
        ),
        isEmailVerified: Crypto.encrypt("false", "database"),
        isTelVerified: Crypto.encrypt("false", "database"),
        is2FAEnabled: Crypto.encrypt("false", "database"),
        picture: Crypto.encrypt("/default/profile/" + req.body.picture, "database"),
        status: Crypto.encrypt("false", "database"),
        friends: [],

      })

      if (user) {
        return res.status(200).json({
          message: "success",
        });
      }

      //TODO log the error
      return res.status(401).json({
        error: "Cet utilisateur existe déjà",
      });

    } catch (error) {
      //TODO log the error
      return res.status(401).json({
        error: "Impossible d'enregistrer l'utilisateur",
      });
    }
  };

  public readonly updateTokens = (req: Request, res: Response): Response => {
    const refreshToken = req.body.refresh_token;

    if (!refreshToken)
      return res.status(401).json({ error: "Missing refresh token" });

    const userId = JWTUtils.getUserFromToken(refreshToken, Tokens.refreshToken);

    // Vérifier si le refreshToken est stocké et valide
    if (userId == undefined)
      return res.status(403).json({ error: "Invalid refresh token" });

    const newAccessToken = JWTUtils.generateTokenForUser(
      userId,
      Tokens.accessToken
    );
    const newRefreshToken = JWTUtils.generateTokenForUser(
      userId,
      Tokens.accessToken
    );

    return res.status(200).json({
      message: "refresh success",
      access_token: newAccessToken,
      refresh_token: newRefreshToken,
    });
  };

  public readonly isValidTokens = (req: Request, res: Response): Response => {
    const accessToken = req.body.access_token;
    const refreshToken = req.body.refresh_token;

    if (!accessToken || !refreshToken)
      return res.status(401).json({ error: "Missing tokens" });

    const accessTokenUserId = JWTUtils.getUserFromToken(
      accessToken,
      Tokens.accessToken
    );
    const refreshTokenUserId = JWTUtils.getUserFromToken(
      refreshToken,
      Tokens.refreshToken
    );

    // Vérifier si le refreshToken est stocké et valide
    if (refreshTokenUserId == undefined)
      return res.status(403).json({ error: "Invalid tokens" });

    if (accessTokenUserId == undefined)
      return res.status(403).json({ error: "Invalid access token" });

    return res.status(200).json({ message: "Valid Tokens" });
  };

  public readonly addFriend = async (req: Request, res: Response): Promise<Response> => {
    //salt should always be in number for because bcrypt generate salt only for salt in number not string
    const userId = JWTUtils.getUserFromToken(req.body.access_token, "access_token")

    //check if the username exits
    try {
      const user = await UserModel.findById(userId)
      const friend = await UserModel.findOne({ username: Crypto.encrypt(req.body.username, "username") })

      if (!friend) {
        return res.status(401).json({
          error: "Cet utilisateur n'existe pas",
        })
      }

      if (user.friends.includes(friend.id)) {
        return res.status(403).json({
          error: "Vous êtes déjà amis avec cet Utilisateur",
        })
      }

      const friendRequest = await FriendsRequestModel.insertMany({
        sender: user.id,
        receiver: friend.id,
        comment: Crypto.encrypt(req.body.comment, "database"),
        status: Crypto.encrypt('PENDING', "database")
      })

      fetch(`${protocol()}://${SERVICES[process.env.NODE_ENV][Services.notification].domain}:${SERVICES[process.env.NODE_ENV][Services.notification].port}/`, {
        method: 'POST',
        headers: headers,
        body: JSON.stringify({
          access_token: req.body.access_token,
          receiver: friend.id,
          content: `Vous avez reçu une nouvelle demande d'amis de ${user.username}`
        })
      })

      return res.status(200).json({
        message: "Demande d'amis envoyée avec succèss",
      })

    } catch (error) {
      console.log(error)
      return res.status(401).json({
        error: "Impossible d'envoyer la demande d'amis",
      });
    }

  };

  public readonly deleteFriend = (req: Request, res: Response): Response => {
    return null;
  };

  public readonly checkIfExists = async (
    req: Request,
    res: Response
  ): Promise<Response> => {
    const { username, tel, email } = req.query;

    try {
      const emailParam = req.query.email;
      const usernameParam = req.query.username;
      const telParam = req.query.tel;

      const encryptedEmail: string =
        typeof emailParam === "string"
          ? Crypto.encrypt(emailParam, "email")
          : null;
      const encryptedUsername: string =
        typeof usernameParam === "string"
          ? Crypto.encrypt(usernameParam, "username")
          : null;
      const encryptedTel: string =
        typeof telParam === "string" ? Crypto.encrypt(telParam, "tel") : null;
      const query: any = {};
      if (encryptedEmail) query.email = encryptedEmail;
      if (encryptedUsername) query.username = encryptedUsername;
      if (encryptedTel) query.tel = encryptedTel;

      const user = await UserModel.findOne(query);

      if (user) {
        return res.status(409).json({
          message: "An account with the provided information already exists.",
        });
      } else {
        return res.status(200).json({
          message: "No existing account found with the provided information.",
        });
      }
    } catch (error) {
      console.error("Error checking if user exists:", error);
      return res.status(500).json({
        error: "Internal Server Error",
      });
    }
  };
}
