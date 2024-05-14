/**
*
*Ce code définit une classe API qui facilite les requêtes HTTP vers une API distante. Il inclut des méthodes pour l'authentification, la vérification de l'authenticité des jetons, l'envoi de messages, la gestion des amis, etc. Les requêtes sont configurées avec des en-têtes comprenant des jetons d'authentification et sont envoyées avec les données nécessaires au format JSON. Des gestionnaires d'erreurs sont inclus pour gérer les réponses de l'API, notamment pour actualiser les jetons d'authentification et rediriger vers la page de connexion en cas d'erreur d'authentification.
 * @module modules/API
 */
import { Crypto } from "../crypto/Crypto";
import CONFIG from "../../config/config.json";
import { Tokens } from "../..//utils/Tokens";
import { redirect } from "react-router-dom";
import Socket from "../socket/Socket";

export type Method = "GET" | "HEAD" | "POST" | "OPTIONS";

export default class API {
  private static readonly tokenPrefix: string = "Bearer ";

  private static readonly apiUrl: string = `${CONFIG.api_url}/${CONFIG.api_basepath}/v${CONFIG.api_version}`;

  private static readonly headers: HeadersInit = {
    accept: "application/json",
    "content-type": "application/json",
    //'user-agent': 'chat-application/client/proxy',
    //['Access-Control-Allow-Origin']: "http://localhost:3000",
    ["authorization"]:
      "Basic " +
      Crypto.encode(`${CONFIG.basic_username}:${CONFIG.basic_password}`),
    credentials: "include",
  };

  private static readonly generateBody = (data: any) => {
    const access_token = window.electron.store.get(
      "chat-application-access_token"
    );
    const refresh_token = window.electron.store.get(
      "chat-application-refresh_token"
    );

    return JSON.stringify({
      ...data,
      access_token,
      refresh_token,
    });
  };

  private static readonly generateURL = (url: string) => {
    const urlObject = new URL(url);

    const access_token = window.electron.store.get(
      "chat-application-access_token"
    );
    const refresh_token = window.electron.store.get(
      "chat-application-refresh_token"
    );

    urlObject.searchParams.set("access_token", access_token);
    urlObject.searchParams.set("refresh_token", refresh_token);

    return urlObject.toString();
  };

  private static handleRequest = async (responseData: any) => {
    if (
      responseData.message &&
      responseData.access_token &&
      responseData.refresh_token
    ) {
      window.electron.store.set(
        "chat-application-access_token",
        responseData.access_token
      );
      window.electron.store.set(
        "chat-application-refresh_token",
        responseData.refresh_token
      );
      return false;
    } else if (responseData.error && responseData.error == "unauthenticated") {
      const access_token = window.electron.store.get(
        "chat-application-access_token"
      );
      const refresh_token = window.electron.store.get(
        "chat-application-refresh_token"
      );
      const response = await this.refreshTokens({
        access_token,
        refresh_token,
      });
      if (response.message) {
        window.electron.store.set(
          "chat-application-access_token",
          response.access_token
        );
        window.electron.store.set(
          "chat-application-refresh_token",
          response.refresh_token
        );
        return true;
      }
      //TODO redirect to the login page
      redirect("/signin");
      return false;
    }
    return false;
  };

  public static readonly refreshTokens = async (
    data: any,
    headers: HeadersInit = {}
  ): Promise<any> => {
    let responseData = null;
    try {
      const response = await fetch(this.apiUrl + "/users/token", {
        method: "PUT",
        headers: { ...this.headers, ...headers },
        body: JSON.stringify(data),
      });
      responseData = await response.json();
    } catch (error) {
      console.log("error " + error);
    }
    return responseData;
  };

  public static readonly checkAuthentication = async (
    data: any,
    headers: HeadersInit = {}
  ): Promise<any> => {
    let responseData = null;
    try {
      const response = await fetch(this.apiUrl + "/users/token", {
        method: "POST",
        headers: { ...this.headers },
        body: JSON.stringify(data),
      });
      responseData = await response.json();
    } catch (error) {
      console.log("error " + error);
    }
    return responseData;
  };

  public static readonly checkIfExist = async (
    data: any,
    headers: HeadersInit = this.headers
  ): Promise<any> => {
    let responseData = null;
    try {
      const response = await fetch(this.apiUrl + "/users/checkUnique", {
        method: "POST",
        headers: { ...this.headers, ...headers },
        body: JSON.stringify(data),
      });
      responseData = await response.json();
    } catch (error) {
      console.log("error " + error);
    }
    return responseData;
  };
  public static readonly getCSRFToken = async (): Promise<any> => {
    let responseData = null;
    let handleRequest = false;
    try {
      const response = await fetch(this.apiUrl + "/form", {
        method: "GET",
        headers: {
          ...this.headers,
        },
      });
      responseData = await response.json();
    } catch (error) {
      console.log("error " + error);
    }
    //handleRequest = await this.handleRequest(responseData);
    //if (handleRequest) return this.getCSRFToken();
    return responseData;
  };

  public static readonly getUserConversation = async (
    id: string,
    headers: HeadersInit = {}
  ): Promise<any> => {
    let responseData = null;
    let handleRequest = false;
    try {
      const url = this.generateURL(
        this.apiUrl + "/chats/conversations/" + id
      );
      const response = await fetch(url, {
        method: "GET",
        headers: {
          ...this.headers,
          ...headers,
        },
      });
      responseData = await response.json();
    } catch (error) {
      console.log("error " + error);
    }
    handleRequest = await this.handleRequest(responseData);
    if (handleRequest) return this.getUserConversation(id);
    return responseData;
  };

  public static readonly getUserConversations = async (
    headers: HeadersInit = {}
  ): Promise<any> => {
    let responseData = null;
    let handleRequest = false;
    try {
      const url = this.generateURL(this.apiUrl + "/chats/conversations/");
      const response = await fetch(url, {
        method: "GET",
        headers: {
          ...this.headers,
          ...headers,
        },
      });
      responseData = await response.json();
    } catch (error) {
      console.log("error " + error);
    }
    handleRequest = await this.handleRequest(responseData);
    if (handleRequest) return this.getUserConversations();
    return responseData;
  };
  public static readonly sendMessage = async (
    id: string,
    data: any,
    headers: HeadersInit = {}
  ): Promise<any> => {
    let responseData = null;
    let handleRequest = false;
    try {
      const response = await fetch(this.apiUrl + "/chats/conversations/" + id, {
        method: "POST",
        headers: {
          ...this.headers,
          ...headers,
        },
        body: this.generateBody(data),
      });
      responseData = await response.json();
    } catch (error) {
      console.log("error " + error);
    }
    handleRequest = await this.handleRequest(responseData);
    if (handleRequest) return this.sendMessage(id, data);
    return responseData;
  };
  public static readonly login = async (
    data: any,
    headers: HeadersInit = {}
  ): Promise<any> => {
    let responseData = null;
    let handleRequest = false;
    try {
      const response = await fetch(this.apiUrl + "/users/signin", {
        method: "POST",
        headers: {
          ...this.headers,
          ...headers,
        },
        body: this.generateBody(data),
      });
      responseData = await response.json();
    } catch (error) {
      console.log("error " + error);
    }
    handleRequest = await this.handleRequest(responseData);
    if (handleRequest) return this.login(data);
    return responseData;
  };

  public static readonly register = async (
    data: any,
    headers: HeadersInit = {}
  ): Promise<any> => {
    let responseData = null;
    try {
      const response = await fetch(this.apiUrl + "/users/signup", {
        method: "POST",
        headers: { ...this.headers, ...headers },
        body: JSON.stringify(data),
      });
      responseData = await response.json();
    } catch (error) {
      console.log("error " + error);
    }
    return responseData;
  };

  public static readonly sendFriendRequest = async (
    data: any,
    headers: HeadersInit = {}
  ): Promise<any> => {
    let responseData = null;
    let handleRequest = false;
    try {
      const response = await fetch(this.apiUrl + "/users/friends/request", {
        method: "POST",
        headers: {
          ...this.headers,
          ...headers,
        },
        body: this.generateBody(data),
      });
      responseData = await response.json();
    } catch (error) {
      console.log("error " + error);
    }
    handleRequest = await this.handleRequest(responseData);
    if (handleRequest) return this.sendFriendRequest(data);
    return responseData;
  };
  public static readonly getFriendsRequests = async (
    headers: HeadersInit = {}
  ): Promise<any> => {
    let responseData = null;
    let handleRequest = false;
    try {
      const url = this.generateURL(
        this.apiUrl + "/users/friends/request"
      );
      const response = await fetch(url, {
        method: "GET",
        headers: {
          ...this.headers,
          ...headers,
        },
      });
      responseData = await response.json();
    } catch (error) {
      console.log("error " + error);
    }
    handleRequest = await this.handleRequest(responseData);
    if (handleRequest) return this.getFriendsRequests();
    return responseData;
  };

  public static readonly updateFriendRequest = async (
    id: string,
    data: any,
    headers: HeadersInit = {}
  ): Promise<any> => {
    let responseData = null;
    let handleRequest = false;
    const url = this.apiUrl + "/users/friends/request/" + id;
    try {
      const response = await fetch(url, {
        method: "PUT",
        headers: {
          ...this.headers,
          ...headers,
        },
        body: await this.generateBody(data),
      });
      responseData = await response.json();
    } catch (error) {
      console.log("error " + error);
    }
    handleRequest = await this.handleRequest(responseData);
    if (handleRequest) return this.updateFriendRequest(id, data);
    return responseData;
  };
  public static readonly updateChat = async (
    id: string,
    data: { _csrf: string },
    headers: HeadersInit = {}
  ): Promise<any> => {
    let responseData = null;
    let handleRequest = false;
    const url = this.apiUrl + "/chats/conversations/" + id;
    try {
      const response = await fetch(url, {
        method: "PUT",
        headers: {
          ...this.headers,
          ...headers,
        },
        body: await this.generateBody(data),
      });
      responseData = await response.json();
    } catch (error) {
      console.log("error " + error);
    }
    handleRequest = await this.handleRequest(responseData);
    if (handleRequest) return this.updateChat(id, data);
    return responseData;
  };
}
