import { HttpMethods, AuthSchemes } from './Enums';
import ILoadingProvider from './ILoadingProvider';
export default abstract class AbstractApi {
    readonly apiRoot: string;
    readonly apiRequiresAuth: boolean;
    hasAuthService: boolean;
    private readonly authService?;
    protected readonly loadingProvider?: ILoadingProvider;
    constructor(apiRoot: string, requiresAuth: boolean, getToken?: (...args: any[]) => string, loadingProvider?: ILoadingProvider, authScheme?: AuthSchemes);
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