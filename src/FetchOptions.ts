import { HttpMethods } from "./Enums";

export interface FetchOptions {
  body?: object;
  [prop: string]: any;
}

export interface InternalFetch {
  method: HttpMethods;
  [prop: string]: any;
}
