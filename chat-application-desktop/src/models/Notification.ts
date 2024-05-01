import { NotificationTypes } from "../utils/keywords";

export class Notification {
  private _id: number;
  private _content: string;
  private _isSeen: boolean;
  public _type: NotificationTypes;

  public constructor(id: number, content: string, type: NotificationTypes) {
    this._content = content;
		this._type = type;
		this._isSeen = false; 
  }

  public get id(): number {
    return this._id;
  }
  public set id(value: number) {
    this._id = value;
  }
  public get content(): string {
    return this._content;
  }
  public set content(value: string) {
    this._content = value;
  }
  public get read(): boolean {
    return this._isSeen;
  }
  public set read(value: boolean) {
    this._isSeen = value;
  }
}