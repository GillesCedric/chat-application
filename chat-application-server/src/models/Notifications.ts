class Notification {
  private _id: Conversation;

  private _conversation: Conversation;

  private _chat: Chat[];

  private _sender: User;

  constructor(conversation: Conversation, chat: Chat[], sender: User) {
    this.conversation = conversation;
    this.chat = chat;
    this.sender = sender;
  }

  public get conversation(): Conversation {
    return this._conversation;
  }
  public set conversation(value: Conversation) {
    this._conversation = value;
  }

  public get sender(): User {
    return this._sender;
  }
  public set sender(value: User) {
    this._sender = value;
  }

  public get chat(): Chat[] {
    return this._chat;
  }
  public set chat(value: Chat[]) {
    this._chat = value;
  }

  public get id(): Conversation {
    return this._id;
  }
  public set id(value: Conversation) {
    this._id = value;
  }
}
