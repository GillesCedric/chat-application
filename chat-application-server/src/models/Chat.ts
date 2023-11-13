class Chat {
    private _id: string;
  
    private _content: string;
  
    private _deleted: boolean;
  
    private _sender: User;
  
    constructor(
      content: string,
      deleted: boolean,
      sender: User
    ) {
      this.content = content;
      this.deleted = deleted;
      this.sender = sender;
    }
  
    public get content(): string {
      return this._content;
    }
    public set content(value: string) {
      this._content = value;
    }
  
    public get sender(): User {
      return this._sender;
    }
    public set sender(value: User) {
      this._sender = value;
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
  }
  