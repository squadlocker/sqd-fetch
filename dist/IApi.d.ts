import { FetchOptions } from './FetchOptions';
export interface FetchMethod {
    (url: string, options?: FetchOptions): Promise<any>;
}
export default interface IApi {
    readonly apiRoot: string;
    readonly apiRequiresAuth: boolean;
    get: FetchMethod;
    post: FetchMethod;
    put: FetchMethod;
    patch: FetchMethod;
    delete: FetchMethod;
}
//# sourceMappingURL=IApi.d.ts.map