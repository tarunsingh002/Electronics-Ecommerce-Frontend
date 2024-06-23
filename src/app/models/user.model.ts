export class User {
  constructor(
    public id: number,
    public email: string,
    private _token: string,
    private _tokenExpirationDate: Date,
    private _refreshToken: string,
    private _refreshTokenExpirationDate: Date,
    public webmaster: boolean = false
  ) {}

  get token() {
    if (!this._tokenExpirationDate || new Date() > this._tokenExpirationDate) {
      return null;
    } else {
      return this._token;
    }
  }

  set token(token: string) {
    this._token = token;
  }

  set refreshToken(refreshToken: string) {
    this._refreshToken = refreshToken;
  }

  get refreshToken() {
    if (
      !this._refreshTokenExpirationDate ||
      new Date() > this._refreshTokenExpirationDate
    ) {
      return null;
    } else {
      return this._refreshToken;
    }
  }
}
