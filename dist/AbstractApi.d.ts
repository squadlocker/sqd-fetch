import { HttpMethods, AuthSchemes } from './Enums';
export default abstract class AbstractApi {
    readonly apiRoot: string;
    readonly apiRequiresAuth: boolean;
    hasAuthService: boolean;
    private authService?;
    constructor(apiRoot: string, requiresAuth: boolean, getToken?: (...args: any[]) => string, authScheme?: AuthSchemes);
    protected abstract resolve(response: Response): Promise<any>;
    fetch(url: string, options: RequestInit): Promise<any>;
    get(url: string, options?: RequestInit): Promise<any>;
    post(url: string, options?: RequestInit): Promise<any>;
    put(url: string, options?: RequestInit): Promise<any>;
    patch(url: string, options?: RequestInit): Promise<any>;
    delete(url: string, options?: RequestInit): Promise<any>;
    protected createRequestInit(method: HttpMethods, options?: RequestInit): RequestInit;
}
//# sourceMappingURL=AbstractApi.d.ts.map