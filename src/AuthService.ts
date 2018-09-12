import { AuthSchemes } from "./Enums";

export default class AuthService {
  readonly authScheme: AuthSchemes;
  private readonly _retrieveToken: () => string;
  private _token?: string;

  constructor(authScheme: AuthSchemes, getToken: () => string) {
    this.authScheme = authScheme;
    this._retrieveToken = getToken;
  }

  setToken(): void {
    this._token = this._retrieveToken();
  }

  getToken = (): string | undefined => this._token;
}
