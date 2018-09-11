import { HttpMethods } from "./Enums";

export interface FetchOptions {
  headers?: FetchHeaders;
  body: string; // need to use JSON.stringify before passing
  [prop: string]: any;
}

export interface FetchHeaders {
  [prop: string]: string;
}
