import { HttpMethods } from "./Enums";

export interface FetchOptions {
  body?: object;
  [prop: string]: any;
}

export interface InternalFetch {
  method: HttpMethods;
  headers: FetchHeaders;
  [prop: string]: any;
}

export interface FetchHeaders {
  Authentication?: string;
  'Content-Type'?: string;
}
