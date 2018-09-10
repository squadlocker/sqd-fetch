import { HttpMethods } from "./Enums";
export interface FetchOptions {
    body: object;
    [prop: string]: any;
}
export interface InternalFetchOptions {
    method: HttpMethods;
    headers: FetchHeaders;
    body: object;
    [prop: string]: any;
}
export interface FetchHeaders {
    Authentication?: string;
    'Content-Type'?: string;
}
//# sourceMappingURL=FetchOptions.d.ts.map