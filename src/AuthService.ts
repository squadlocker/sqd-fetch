import { AuthSchemes } from "./Enums";

export default class AuthService {
  readonly authScheme: AuthSchemes;
  private readonly _getToken: () => string;
  token?: string;

  constructor(authScheme: AuthSchemes, getToken: () => string) {
    this.authScheme = authScheme;
    this._getToken = getToken;
  }

  setToken(): void {
    this.token = this._getToken();
  }
}
