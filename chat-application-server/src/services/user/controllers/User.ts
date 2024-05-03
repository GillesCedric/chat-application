import { UserModel, UserStatus } from "../../../models/User";
import {
  FriendsRequestModel,
  FriendsRequestStatus,
} from "../../../models/FriendsRequest";
import { Request, Response } from "express";
import bcrypt from "bcrypt";
import JWTUtils from "../../../modules/jwt/JWT";
import { Crypto } from "../../../modules/crypto/Crypto";
import { Code, Method, headers, protocol } from "../../../utils/HTTP";
import { Services, SocketKeywords, Tokens } from "../../../utils/Keywords";
import SERVICES from "../../../config/services.json";
import { Keys, Purposes, TokenModel } from "../../../models/Token";
import Mailer from "../../../modules/mailer/Mailer";
import fs from "fs";
import path from "path";

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
        UserModel.find({ id: { $in: friendsId } }).then((friends) => {
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

  public readonly me = async (req: Request, res: Response): Promise<Response> => {
    const userId = JWTUtils.getUserFromToken(req.query.access_token as string, "access_token")
    try {
      const user = await UserModel.findById(userId).select(
        "lastname firstname username tel email isEmailVerified isTelVerified is2FAEnabled picture status"
      );

      if (!user) {
        return res.status(500).json({
          error: "Cet utilisateur n'existe pas",
        });
      }

      user.lastname = Crypto.decrypt(user.lastname, "database");
      user.firstname = Crypto.decrypt(user.firstname, "database");
      user.username = Crypto.decrypt(user.username, "username");
      user.tel = Crypto.decrypt(user.tel, "tel");
      user.email = Crypto.decrypt(user.email, "email");
      user.isEmailVerified = Crypto.decrypt(user.isEmailVerified, "database");
      user.isTelVerified = Crypto.decrypt(user.isTelVerified, "database");
      user.is2FAEnabled = Crypto.decrypt(user.is2FAEnabled, "database");
      user.picture = Crypto.decrypt(user.picture, "database");
      user.status = Crypto.decrypt(user.status, "database");

      return res.status(200).json({
        user,
      });
    } catch (error) {
      console.log(error);
      return res.status(500).json({
        error: "Erreur lors de la vérification des informations",
      });
    }
  };

  public readonly updateProfile = async (req: Request, res: Response): Promise<Response> => {
    const userId = JWTUtils.getUserFromToken(req.body.access_token, "access_token")
    const { firstname, lastname, username, password, is2FAEnabled } = req.body
    try {
      const updates: {
        firstname?: string
        lastname?: string
        username?: string
        password?: string
        is2FAEnabled?: string
      } = {}
      if (firstname) updates.firstname = Crypto.encrypt(firstname, "database");
      if (lastname) updates.lastname = Crypto.encrypt(lastname, "database");
      if (username) updates.username = Crypto.encrypt(username, "username");
      if (password) updates.password = bcrypt.hashSync(
        password,
        Number.parseInt(process.env.SALT_ROUNDS)
      )
      if (is2FAEnabled) updates.is2FAEnabled = Crypto.encrypt(is2FAEnabled, "boolean");
      // Mise à jour de l'utilisateur dans la base de données
      const updatedUser = await UserModel.findByIdAndUpdate(userId, updates, { new: true }).select("lastname firstname username tel email isEmailVerified isTelVerified is2FAEnabled picture status");

      return res.status(200).json({
        message: 'Profile updated successfully',
        data: updatedUser
      })
    } catch (error) {
      console.log(error);
      return res.status(500).json({
        error: "Erreur lors de la modifications des informations",
      });
    }
  };

  public readonly signIn = async (
    req: Request,
    res: Response
  ): Promise<Response> => {
    try {
      const user = await UserModel.findOne({
        email: Crypto.encrypt(req.body.email, "email"),
      });

      if (!user) {
        return res.status(401).json({
          error: "Incorrect email or password",
        });
      }

      const passwordMatches = bcrypt.compareSync(
        req.body.password,
        user.password
      );

      if (!passwordMatches) {
        return res.status(401).json({
          error: "Incorrect email or password",
        });
      }

      if (Crypto.decrypt(user.isEmailVerified, "boolean") == "false") {
        return res.status(403).json({
          error:
            "Votre compte n'est pas encore activé! Vous ne pouvez pas encore vous connecter",
        });
      }

      if (Crypto.decrypt(user.is2FAEnabled, 'boolean') == "true") {
        const userCode = Crypto.randomInt(6)

        const validity = new Date()

        await TokenModel.insertMany({
          user: user._id,
          key: Crypto.encrypt(Keys.tel, 'status'),
          token: bcrypt.hashSync(userCode, Number.parseInt(process.env.SALT_ROUNDS)),
          validity: validity.setMinutes(validity.getMinutes() + Number.parseInt(process.env.TWOFA_TEL_CODE_DELAY)),
          purpose: Crypto.encrypt(Purposes.connection, 'status')
        })

        await Mailer.sendSMS({
          to: Crypto.decrypt(user.tel, 'tel'), // Change to your recipient
          messagingServiceSid: process.env.TWILLIO_MESSAGING_SERVICE_SID,
          body: fs.readFileSync(path.join(process.cwd(), 'src', 'templates', 'TelVerification.txt'), 'utf8').replace('{{USERNAME}}', Crypto.decrypt(user.username, 'username')).replace('{{CODE}}', userCode).replace('{{APPNAME}}', 'Chat-Application').replace('{{CODE_DELAY}}', process.env.TWOFA_TEL_CODE_DELAY),
        })

        return res.status(200).json({
          message: "connection pending",
          reason: "2FAEnabled",
        });

      }

      user.status = Crypto.encrypt(UserStatus.online, "status")
      await user.save()

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
      });
    } catch (error) {
      console.log(error);
      return res.status(500).json({
        error: "Cet utilisateur n'existe pas",
      });
    }
  };

  public readonly activateEmail = async (req: Request, res: Response): Promise<Response> => {

    try {
      const userToken = JWTUtils.getDataFromToken(req.query.token as string);

      if (userToken == undefined) {
        res.sendFile(
          path.join(process.cwd(), "public", "VerificationEmailError.html")
        );
        return;
      }

      userToken.userId = Crypto.decrypt(userToken.userId, "data");
      userToken.key = Crypto.decrypt(userToken.key, "data");
      userToken.purpose = Crypto.decrypt(userToken.purpose, "data");
      userToken.code = Crypto.decrypt(userToken.code, "data");

      const user = await UserModel.findById(userToken.userId);

      if (Crypto.decrypt(user.isEmailVerified, "boolean") == "true") {
        res.sendFile(
          path.join(process.cwd(), "public", "EmailAlreadyVerified.html")
        );
        return;
      }

      const token = await TokenModel.findOne({
        user: userToken.userId,
        key: Crypto.encrypt(userToken.key, "status"),
        purpose: Crypto.encrypt(userToken.purpose, "status"),
        validity: { $gt: new Date() },
      }).sort({ createdAt: -1 });

      if (!token) {
        res.sendFile(
          path.join(process.cwd(), "public", "VerificationEmailError.html")
        );
        return;
      }

      const tokenMatches = bcrypt.compareSync(userToken.code, token.token);

      if (!tokenMatches) {
        res.sendFile(
          path.join(process.cwd(), "public", "VerificationEmailError.html")
        );
        return;
      }

      await UserModel.findByIdAndUpdate(userToken.userId, {
        isEmailVerified: Crypto.encrypt("true", "boolean"),
      });

      res.sendFile(
        path.join(process.cwd(), "public", "VerificationEmailSuccess.html")
      );
      return;
    } catch (error) {
      console.log(error);
      return res.status(500).json({
        error: "Internal server Error",
      });
    }
  };

  public readonly activateTel = async (req: Request, res: Response): Promise<Response> => {

    try {
      const userId = JWTUtils.getUserFromToken(req.body.access_token, "access_token")

      const user = await UserModel.findById(userId)

      if (Crypto.decrypt(user.isTelVerified, 'boolean') == "true") {
        return res.status(403).json({
          error: "Votre numéro de téléphone a déjà été vérifié",
        });
      }

      const token = await TokenModel.findOne({
        user: userId,
        key: Crypto.encrypt(Keys.tel, 'status'),
        purpose: Crypto.encrypt(Purposes.verification, 'status'),
        validity: { $gt: new Date() }
      }).sort({ createdAt: -1 })

      if (!token) {
        return res.status(403).json({
          error: "Erreur lors de la vérification",
        });
      }

      const tokenMatches = bcrypt.compareSync(
        req.body.code,
        token.token
      );

      if (!tokenMatches) {
        return res.status(403).json({
          error: "Le code saisie est invalide",
        });
      }

      await UserModel.findByIdAndUpdate(userId, {
        isTelVerified: Crypto.encrypt("true", "boolean")
      })

      return res.status(200).json({
        message: "vérification effectuée avec succèss",
      });

    } catch (error) {
      console.log(error);
      return res.status(500).json({
        error: "Internal server Error",
      });
    }
  };

  public readonly verifyTel = async (req: Request, res: Response): Promise<Response> => {

    try {
      const userId = JWTUtils.getUserFromToken(req.body.access_token, "access_token")

      const user = await UserModel.findById(userId)

      const userCode = Crypto.randomInt(6)

      const validity = new Date()

      await TokenModel.insertMany({
        user: user._id,
        key: Crypto.encrypt(Keys.tel, 'status'),
        token: bcrypt.hashSync(userCode, Number.parseInt(process.env.SALT_ROUNDS)),
        validity: validity.setMinutes(validity.getMinutes() + Number.parseInt(process.env.VERIFY_TEL_CODE_DELAY)),
        purpose: Crypto.encrypt(Purposes.verification, 'status')
      })

      await Mailer.sendSMS({
        to: Crypto.decrypt(user.tel, 'tel'), // Change to your recipient
        messagingServiceSid: process.env.TWILLIO_MESSAGING_SERVICE_SID,
        body: fs.readFileSync(path.join(process.cwd(), 'src', 'templates', 'TelVerification.txt'), 'utf8').replace('{{USERNAME}}', Crypto.decrypt(user.username, 'username')).replace('{{CODE}}', userCode).replace('{{APPNAME}}', 'Chat-Application').replace('{{CODE_DELAY}}', process.env.VERIFY_TEL_CODE_DELAY),
      })

      return res.status(200).json({
        message: "Message envoyé avec succèss",
      });

    } catch (error) {
      console.log(error);
      return res.status(500).json({
        error: "Internal server Error",
      });
    }
  };

  public readonly connect = async (req: Request, res: Response): Promise<Response> => {

    try {

      const token = await TokenModel.findOne({
        user: req.body.userId,
        key: Crypto.encrypt(Keys.tel, 'status'),
        purpose: Crypto.encrypt(Purposes.connection, 'status'),
        validity: { $gt: new Date() }
      }).sort({ createdAt: -1 })

      if (!token) {
        return res.status(403).json({
          error: "Erreur lors de la vérification",
        });
      }

      const tokenMatches = bcrypt.compareSync(
        req.body.code,
        token.token
      );

      if (!tokenMatches) {
        return res.status(403).json({
          error: "Le code saisie est invalide",
        });
      }

      const user = await UserModel.findByIdAndUpdate(req.body.userId, {
        status: Crypto.encrypt(UserStatus.online, "status")
      })

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
      });

    } catch (error) {
      console.log(error);
      return res.status(500).json({
        error: "Internal server Error",
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
        isEmailVerified: Crypto.encrypt("false", "boolean"),
        isTelVerified: Crypto.encrypt("false", "boolean"),
        is2FAEnabled: Crypto.encrypt("false", "boolean"),
        picture: Crypto.encrypt(
          `${protocol()}://${SERVICES[process.env.NODE_ENV][Services.apigw].domain}:${SERVICES[process.env.NODE_ENV][Services.apigw].port}/images/default/profile/${req.body.picture}`,
          "database"
        ),
        status: Crypto.encrypt(UserStatus.offline, "status"),
        friends: [],
      });

      if (user) {
        const userCode = Crypto.random().toUpperCase();

        const token = JWTUtils.generateTokenWithData({
          userId: Crypto.encrypt(user[0].id, "data"),
          code: Crypto.encrypt(userCode, "data"),
          key: Crypto.encrypt(Keys.email, "data"),
          purpose: Crypto.encrypt(Purposes.verification, "data"),
        });

        const validity = new Date();

        await TokenModel.insertMany({
          user: user[0]._id,
          key: Crypto.encrypt(Keys.email, "status"),
          token: bcrypt.hashSync(
            userCode,
            Number.parseInt(process.env.SALT_ROUNDS)
          ),
          validity: validity.setMinutes(
            validity.getMinutes() +
              Number.parseInt(process.env.VERIFY_EMAIL_CODE_DELAY)
          ),
          purpose: Crypto.encrypt(Purposes.verification, "status"),
        });

        await Mailer.sendMail({
          to: req.body.email, // Change to your recipient
          from: process.env.TWILLIO_MAILER_EMAIL, // Change to your verified sender
          subject: "Chat-Application | Verification de compte",
          html: fs
            .readFileSync(
              path.join(
                process.cwd(),
                "src",
                "templates",
                "EmailVerification.html"
              ),
              "utf8"
            )
            .replace("{{USERNAME}}", req.body.username)
            .replace(
              "{{VERIFICATION_URL}}",
              `${protocol()}://${
                SERVICES[process.env.NODE_ENV][Services.apigw].domain
              }:${
                SERVICES[process.env.NODE_ENV][Services.apigw].port
              }/api/v1/users/activate/email?token=${token}`
          ).replace('{{CODE_DELAY}}', (process.env.VERIFY_EMAIL_CODE_DELAY as unknown as number / 60) as unknown as string),
        });

        return res.status(200).json({
          message: "Inscription réussie avec success",
        });
      }

      //TODO log the error
      return res.status(401).json({
        error: "Cet utilisateur existe déjà",
      });
    } catch (error) {
      //TODO log the error
      console.log(error);
      return res.status(401).json({
        error: "Impossible d'enregistrer l'utilisateur",
      });
    }
  };

  public readonly updateTokens = (req: Request, res: Response): Response => {
    const refreshToken = req.body.refresh_token;

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

  public readonly sendFriendRequest = async (
    req: Request,
    res: Response
  ): Promise<Response> => {
    const userId = JWTUtils.getUserFromToken(
      req.body.access_token,
      "access_token"
    );

    //check if the username exits
    try {
      const user = await UserModel.findById(userId);
      const friend = await UserModel.findOne({
        username: Crypto.encrypt(req.body.username, "username"),
      });

      if (!friend) {
        return res.status(401).json({
          error: "Cet utilisateur n'existe pas",
        });
      }

      if (friend.id == user.id) {
        return res.status(401).json({
          error:
            "Vous ne pouvez pas vous envoyer une demande d'amitié à vous même",
        });
      }

      if (user.friends.includes(friend.id)) {
        return res.status(403).json({
          error: "Vous êtes déjà amis avec cet Utilisateur",
        });
      }

      await Promise.all([
        FriendsRequestModel.insertMany({
          sender: user.id,
          receiver: friend.id,
          comment: Crypto.encrypt(req.body.comment, "database"),
          status: Crypto.encrypt(FriendsRequestStatus.pending, "status"),
        }),
        fetch(
          `${protocol()}://${
            SERVICES[process.env.NODE_ENV][Services.notification].domain
          }:${SERVICES[process.env.NODE_ENV][Services.notification].port}/`,
          {
            method: "POST",
            headers: headers(),
            body: JSON.stringify({
              access_token: req.body.access_token,
              receiver: friend.id,
              content: `Vous avez reçu une nouvelle demande d'amis de ${Crypto.decrypt(
                user.username,
                "username"
              )}`,
            }),
          }
        ),
      ]);

      return res.status(200).json({
        message: "Demande d'amis envoyée avec succèss",
      });
    } catch (error) {
      console.log(error);
      return res.status(401).json({
        error: "Impossible d'envoyer la demande d'amis",
      });
    }
  };

  public readonly getUserFriendRequests = async (req: Request, res: Response): Promise<Response> => {

    const userId = JWTUtils.getUserFromToken(req.query.access_token as string, "access_token")

    try {
      const friendRequests = await FriendsRequestModel.find({
        receiver: userId,
        status: Crypto.encrypt(FriendsRequestStatus.pending, "status")
      }).select("_id sender comment createdAt").populate("sender", "username picture")

      if (!friendRequests) {
        return res.status(401).json({
          error: "Impossible de récupérer vos demandes d'amis",
        });
      }

      return res.status(200).json({
        message: 'success',
        data: friendRequests.map(friendRequest => {
          return {
            _id: friendRequest._id,
            sender: {
              _id: friendRequest.sender._id,
              //@ts-ignore
              username: Crypto.decrypt(friendRequest.sender.username, 'username'),
              //@ts-ignore
              picture: Crypto.decrypt(friendRequest.sender.picture, 'database'),
            },
            comment: Crypto.decrypt(friendRequest.comment, 'database'),
            createdAt: friendRequest.createdAt
          }

        }),
      })

    } catch (error) {
      console.log(error);
      return res.status(401).json({
        error: "Internal server error",
      });
    }
  };

  public readonly updateUserFriendRequest = async (
    req: Request,
    res: Response
  ): Promise<Response> => {
    //salt should always be in number for because bcrypt generate salt only for salt in number not string

    //check if the username exits
    try {
      const userId = JWTUtils.getUserFromToken(
        req.body.access_token,
        "access_token"
      );

      const user = await UserModel.findById(userId);

      const friendRequest = await FriendsRequestModel.findById(req.params.id);

      if (!friendRequest) {
        return res.status(401).json({
          error: "Cette demande d'amis n'existe pas",
        });
      }

      if (
        Crypto.decrypt(friendRequest.status, "database") !=
        FriendsRequestStatus.pending
      ) {
        return res.status(403).json({
          error: "Cette demande d'amis a déjà été mise à jour",
        })
      } else if ((user.id == friendRequest.sender && req.body.status == FriendsRequestStatus.deleted) || (user.id == friendRequest.receiver && req.body.status == FriendsRequestStatus.rejected)) {
        friendRequest.status = Crypto.encrypt(req.body.status, 'status')
        await friendRequest.save()
      } else if (user.id == friendRequest.receiver && req.body.status == FriendsRequestStatus.accepted) {

        friendRequest.status = Crypto.encrypt(req.body.status, 'status')

        await Promise.all([
          UserModel.findByIdAndUpdate(
            friendRequest.receiver,
            { $addToSet: { friends: friendRequest.sender } }, // Utilise $addToSet pour éviter les doublons
            { new: true, upsert: false }
          ),
          UserModel.findByIdAndUpdate(
            friendRequest.sender,
            { $addToSet: { friends: friendRequest.receiver } }, // Utilise $addToSet pour éviter les doublons
            { new: true, upsert: false }
          ),
          friendRequest.save(),
          fetch(
            `${protocol()}://${
              SERVICES[process.env.NODE_ENV][Services.notification].domain
            }:${SERVICES[process.env.NODE_ENV][Services.notification].port}/`,
            {
              method: "POST",
              headers: headers(),
              body: JSON.stringify({
                access_token: req.body.access_token,
                receiver: friendRequest.sender,
                content: `${Crypto.decrypt(
                  user.username,
                  "username"
                )} a accepté votre demande d'amis`,
              }),
            }
          ),
          fetch(
            `${protocol()}://${
              SERVICES[process.env.NODE_ENV][Services.chat].domain
            }:${
              SERVICES[process.env.NODE_ENV][Services.chat].port
            }/conversations`,
            {
              method: Method.post,
              headers: headers(),
              body: JSON.stringify({
                access_token: req.body.access_token,
                members: [friendRequest.sender, friendRequest.receiver],
              }),
            }
          ),
        ]);

        return res.status(200).json({
          message: "Demande d'amis mise à jour avec succèss",
        });
      } else {
        return res.status(403).json({
          error: "Vous n'avez pas le droit d'accéder à cette ressource",
        });
      }
    } catch (error) {
      console.log(error);
      return res.status(401).json({
        error: "Impossible de mettre à jour la demande d'amis",
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
