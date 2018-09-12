import { AuthSchemes } from "./Enums";
export default class AuthService {
    readonly authScheme: AuthSchemes;
    private readonly _retrieveToken;
    private _token?;
    constructor(authScheme: AuthSchemes, retrieveToken: () => string);
    setToken(): void;
    getToken: () => string | undefined;
}
//# sourceMappingURL=AuthService.d.ts.map