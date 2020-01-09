export class User {
  static Type = "Jinaga.User";
  type = User.Type;

  constructor (
    public publicKey: string
  ) { }
}