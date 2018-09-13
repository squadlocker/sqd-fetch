import { AuthSchemes } from "./Enums";

export default class AuthService {
  readonly authScheme: AuthSchemes;
  private readonly _retrieveToken: () => string;
  private _token?: string;

  constructor(authScheme: AuthSchemes, retrieveToken: (...args: any[]) => string) {
    this.authScheme = authScheme;
    this._retrieveToken = retrieveToken;
  }

  setToken(): void {
    this._token = this._retrieveToken();
  }

  getToken = (): string | undefined => this._token;
}
