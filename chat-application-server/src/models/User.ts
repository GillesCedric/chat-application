class User {
  private _id: string;

  private _lastname: string;

  private _Username: string;

  private _firstname: string;

  private _tel: string;

  private _email: string;

  private _password: string;

  private _isVerified: string;

  private _friends: User[];

  constructor(
    id: string,
    lastname: string,
    Username: string,
    firstname: string,
    tel: string,
    email: string,
    password: string,
    isVerified: string,
    friends: User[]
  ) {
    this.lastname = lastname;
    this.firstname = firstname;
    this.Username = Username;
    this.email = email;
    this.tel = tel;
    this.password = password;
    this.isVerified = isVerified;
    this.friends = friends;
    this.id = id;
  }

  public get lastname(): string {
    return this._lastname;
  }
  public set lastname(value: string) {
    this._lastname = value;
  }

  public get friends(): User[] {
    return this._friends;
  }
  public set friends(value: User[]) {
    this._friends = value;
  }
  public get Username(): string {
    return this._Username;
  }
  public set Username(value: string) {
    this._Username = value;
  }

  public get password(): string {
    return this._password;
  }
  public set password(value: string) {
    this._password = value;
  }
  public get firstname(): string {
    return this._firstname;
  }
  public set firstname(value: string) {
    this._firstname = value;
  }

  public get email(): string {
    return this._email;
  }
  public set email(value: string) {
    this._email = value;
  }

  public get tel(): string {
    return this._tel;
  }
  public set tel(value: string) {
    this._tel = value;
  }
  public get isVerified(): string {
    return this._isVerified;
  }
  public set isVerified(value: string) {
    this._isVerified = value;
  }

  public get id(): string {
    return this._id;
  }
  public set id(value: string) {
    this._id = value;
  }
}
