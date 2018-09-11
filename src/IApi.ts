import { FetchOptions } from './FetchOptions';
import AuthService from './AuthService';

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
