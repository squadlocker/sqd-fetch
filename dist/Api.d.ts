import IApi from './IApi';
import { FetchOptions } from './FetchOptions';
import { AuthSchemes } from './Enums';
export default class Api implements IApi {
    readonly apiRoot: string;
    readonly apiRequiresAuth: boolean;
    private authService;
    constructor(apiRoot: string, requiresAuth: boolean, getToken: Function, authScheme?: AuthSchemes);
    private fetch;
    get(url: string, options?: FetchOptions): Promise<any>;
    post(url: string, options?: FetchOptions): Promise<any>;
    put(url: string, options?: FetchOptions): Promise<any>;
    patch(url: string, options?: FetchOptions): Promise<any>;
    delete(url: string, options?: FetchOptions): Promise<any>;
    private createRequestInit;
}
//# sourceMappingURL=Api.d.ts.map