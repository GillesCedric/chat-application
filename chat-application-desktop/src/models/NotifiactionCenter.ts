/**
 * Représente une notification.
 * @module models/Notification
 */
import { NotificationTypes } from "../utils/keywords";

export class Notification {
  private _id: number;
  private _content: string;
  private _isSeen: boolean;
  public _type: NotificationTypes;

  /**
   * Crée une nouvelle instance de Notification.
   * @param id L'identifiant de la notification.
   * @param content Le contenu de la notification.
   * @param type Le type de la notification.
   */
  public constructor(id: number, content: string, type: NotificationTypes) {
    this._id = id;
    this._content = content;
    this._type = type;
    this._isSeen = false;
  }

  /**
   * Récupère l'identifiant de la notification.
   * @returns L'identifiant de la notification.
   */
  public get id(): number {
    return this._id;
  }
  /**
   * Définit l'identifiant de la notification.
   * @param value Le nouvel identifiant de la notification.
   */
  public set id(value: number) {
    this._id = value;
  }

  /**
   * Récupère le contenu de la notification.
   * @returns Le contenu de la notification.
   */
  public get content(): string {
    return this._content;
  }
  /**
   * Définit le contenu de la notification.
   * @param value Le nouveau contenu de la notification.
   */
  public set content(value: string) {
    this._content = value;
  }

  /**
   * Indique si la notification a été lue.
   * @returns true si la notification a été lue, sinon false.
   */
  public get read(): boolean {
    return this._isSeen;
  }
  /**
   * Définit si la notification a été lue.
   * @param value true si la notification a été lue, sinon false.
   */
  public set read(value: boolean) {
    this._isSeen = value;
  }
}
