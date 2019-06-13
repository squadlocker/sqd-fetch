import { HttpMethods } from './Enums';
import ISqdProvider from './ISqdProvider';
import IInitOptions from './IInitOptions';
import IRequestOptions from './IRequestOptions';
export default abstract class AbstractApi {
    readonly apiRoot: string;
    readonly apiRequiresAuth: boolean;
    hasAuthService: boolean;
    private readonly authService?;
    protected readonly sqdProvider: ISqdProvider[];
    constructor(apiRoot: string, requiresAuth: boolean, initOptions?: IInitOptions);
    protected abstract resolve(response: Response, options: IRequestOptions): Promise<any>;
    fetch(url: string, options: IRequestOptions): Promise<any>;
    get(url: string, options?: IRequestOptions): Promise<any>;
    post(url: string, options?: IRequestOptions): Promise<any>;
    put(url: string, options?: IRequestOptions): Promise<any>;
    patch(url: string, options?: IRequestOptions): Promise<any>;
    delete(url: string, options?: IRequestOptions): Promise<any>;
    protected createRequestInit(method: HttpMethods, options?: RequestInit): RequestInit;
    addSqdProvider(provider: ISqdProvider): AbstractApi;
    hasSqdProvider(provider: ISqdProvider): boolean;
    indexOfSqdProvider(provider: ISqdProvider): number;
    deleteSqdProvider(provider: ISqdProvider): boolean;
    deleteSqdProviderByIndex(index: number): boolean;
}
//# sourceMappingURL=AbstractApi.d.ts.map