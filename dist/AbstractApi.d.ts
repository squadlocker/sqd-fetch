import { HttpMethods } from './Enums';
import ILoadingProvider from './ILoadingProvider';
import IInitOptions from './IInitOptions';
export default abstract class AbstractApi {
    readonly apiRoot: string;
    readonly apiRequiresAuth: boolean;
    hasAuthService: boolean;
    private readonly authService?;
    protected readonly loadingProvider?: ILoadingProvider;
    constructor(apiRoot: string, requiresAuth: boolean, initOptions?: IInitOptions);
    protected abstract resolve(response: Response, handleLoading: boolean): Promise<any>;
    fetch(url: string, options: IRequestOptions): Promise<any>;
    get(url: string, options?: IRequestOptions): Promise<any>;
    post(url: string, options?: IRequestOptions): Promise<any>;
    put(url: string, options?: IRequestOptions): Promise<any>;
    patch(url: string, options?: IRequestOptions): Promise<any>;
    delete(url: string, options?: IRequestOptions): Promise<any>;
    protected createRequestInit(method: HttpMethods, options?: RequestInit): RequestInit;
}
interface IRequestOptions extends RequestInit {
    handleLoading?: boolean;
}
export {};
//# sourceMappingURL=AbstractApi.d.ts.map