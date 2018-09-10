import { AuthSchemes } from "./Enums";
export default class AuthService {
    readonly authScheme: AuthSchemes;
    private readonly _getToken;
    token?: string;
    constructor(authScheme: AuthSchemes, getToken: Function);
    setToken(): void;
}
//# sourceMappingURL=AuthService.d.ts.map