import { AuthSchemes } from "./Enums";
export default class AuthService {
    readonly authScheme: AuthSchemes;
    private readonly _getToken;
    token?: string;
    constructor(authScheme: AuthSchemes, getToken: () => string);
    setToken(): void;
}
//# sourceMappingURL=AuthService.d.ts.map