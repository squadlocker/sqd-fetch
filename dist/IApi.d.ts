export interface FetchMethod {
    (url: string, options?: RequestInit): Promise<any>;
}
export default interface IApi {
    readonly apiRoot: string;
    readonly apiRequiresAuth: boolean;
    get: FetchMethod;
    post: FetchMethod;
    put: FetchMethod;
    patch: FetchMethod;
    delete: FetchMethod;
    fetch: (url: string, options: RequestInit) => Promise<any>;
}
//# sourceMappingURL=IApi.d.ts.map