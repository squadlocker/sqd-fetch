import IApi from './IApi';
import { FetchOptions } from './FetchOptions';
import { AuthSchemes } from './Enums';
export default class Api implements IApi {
    readonly apiRoot: string;
    readonly apiRequiresAuth: boolean;
    private authService;
    constructor(apiRoot: string, requiresAuth: boolean, getToken: Function, authScheme?: AuthSchemes);
    private fetch;
    get(url: string, options?: FetchOptions, apiUsesHyphens?: boolean): Promise<any>;
    post(url: string, options?: FetchOptions, apiUsesHyphens?: boolean): Promise<any>;
    put(url: string, options?: FetchOptions, apiUsesHyphens?: boolean): Promise<any>;
    patch(url: string, options?: FetchOptions, apiUsesHyphens?: boolean): Promise<any>;
    delete(url: string, options?: FetchOptions, apiUsesHyphens?: boolean): Promise<any>;
    private createInternalFetch;
}
//# sourceMappingURL=Api.d.ts.map