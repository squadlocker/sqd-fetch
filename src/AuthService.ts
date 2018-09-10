import { AuthSchemes } from "./Enums";

export default class AuthService {
  readonly authScheme: AuthSchemes;
  private readonly _getToken: Function;
  token?: string;

  constructor(authScheme: AuthSchemes, getToken: Function) {
    this.authScheme = authScheme;
    this._getToken = getToken;
  }

  setToken(): void {
    this.token = this._getToken();
  }
}