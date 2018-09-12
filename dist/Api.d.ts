import IApi from './IApi';
import { AuthSchemes } from './Enums';
export default class Api implements IApi {
    readonly apiRoot: string;
    readonly apiRequiresAuth: boolean;
    hasAuthService: boolean;
    private authService?;
    constructor(apiRoot: string, requiresAuth: boolean, getToken?: () => string, authScheme?: AuthSchemes);
    private fetch;
    get(url: string, options?: RequestInit): Promise<any>;
    post(url: string, options?: RequestInit): Promise<any>;
    put(url: string, options?: RequestInit): Promise<any>;
    patch(url: string, options?: RequestInit): Promise<any>;
    delete(url: string, options?: RequestInit): Promise<any>;
    private createRequestInit;
}
//# sourceMappingURL=Api.d.ts.map