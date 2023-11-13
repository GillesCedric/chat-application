class Conversation {
  private _id: string;

  private _chats: Chat[];

  private _deleted: boolean;

  private _members: User[];

  private _deletedBy: string;

  constructor(
    deletedBy: string,
    deleted: boolean,
    members: User[],
    id: string,
    chats: Chat[]
  ) {
    this.id = id;
    this.deleted = deleted;
    this.members = members;
    this.deletedBy = deletedBy;
    this.chats = chats;
  }

  public get chats(): Chat[] {
    return this._chats;
  }
  public set chats(value: Chat[]) {
    this._chats = value;
  }

  public get members(): User[] {
    return this._members;
  }
  public set members(value: User[]) {
    this._members = value;
  }

  public get deleted(): boolean {
    return this._deleted;
  }
  public set deleted(value: boolean) {
    this._deleted = value;
  }

  public get id(): string {
    return this._id;
  }
  public set id(value: string) {
    this._id = value;
  }
  public get deletedBy(): string {
    return this._deletedBy;
  }
  public set deletedBy(value: string) {
    this._deletedBy = value;
  }
}
