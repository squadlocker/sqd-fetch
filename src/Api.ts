import IApi, { FetchMethod } from './IApi';
import { FetchOptions, InternalFetchOptions } from './FetchOptions';
import { camelizeObject, hyphenizeObject } from './util/camelizeObject';
import { HttpMethods, AuthSchemes } from './Enums';
import AuthService from './AuthService';

export default class Api implements IApi {
  readonly apiRoot: string;
  readonly apiRequiresAuth: boolean;
  private authService: AuthService;

  constructor(apiRoot: string, requiresAuth: boolean, getToken: Function, authScheme: AuthSchemes = AuthSchemes.Bearer) {
    this.apiRoot = apiRoot;
    this.apiRequiresAuth = requiresAuth;
    this.authService = new AuthService(authScheme, getToken)
  }

  private async fetch(url: string, options: FetchOptions & InternalFetchOptions, apiUsesHyphens?: boolean): Promise<any> {
    if (this.apiRequiresAuth) {
      this.authService.setToken();
      options.headers.Authentication = `${this.authService.authScheme} ${this.authService.token}`;
    }

    // when working with certain frameworks, e.g. Rails, apis will expect and return objects where properties
    // are in hypen-case. 
    if (apiUsesHyphens) {
      options.body = hyphenizeObject(options.body);
    }

    const root = this.apiRoot.endsWith('/') ? this.apiRoot : this.apiRoot + '/';
    const request = new Request(root + url, options);

    const response = await fetch(request);
    if (!response.ok) {
      // allows us to handle error status codes AND custom error responses in a catch
      // block we pass in an Error object so that we can have access to the stacktrace.

      // In some catch block, access the status with err.response.status
      // access any custom response body with err.response.json().then(json => {...})
      const e = new FetchError;
      e.response = response;
      return Promise.reject(e);
    }

    if (response.status === 204) {
      return { status: 204, success: true };
    }

    const json: Promise<any> = await response.json();
    if (!apiUsesHyphens) return json;
    return camelizeObject(json);
  }

  async get(url: string, options?: FetchOptions, apiUsesHyphens?: boolean): Promise<any> {
    const fetchOptions: InternalFetchOptions = this.createInternalFetch(HttpMethods.GET, options);
    return this.fetch(url, fetchOptions, apiUsesHyphens);
  }

  async post(url: string, options?: FetchOptions, apiUsesHyphens?: boolean): Promise<any> {
    const fetchOptions: InternalFetchOptions = this.createInternalFetch(HttpMethods.POST, options);
    return this.fetch(url, fetchOptions, apiUsesHyphens);
  }

  async put(url: string, options?: FetchOptions, apiUsesHyphens?: boolean): Promise<any> {
    const fetchOptions: InternalFetchOptions = this.createInternalFetch(HttpMethods.PUT, options);
    return this.fetch(url, fetchOptions, apiUsesHyphens);
  }

  async patch(url: string, options?: FetchOptions, apiUsesHyphens?: boolean): Promise<any> {
    const fetchOptions: InternalFetchOptions = this.createInternalFetch(HttpMethods.PATCH, options);
    return this.fetch(url, fetchOptions, apiUsesHyphens);
  }

  async delete(url: string, options?: FetchOptions, apiUsesHyphens?: boolean): Promise<any> {
    const fetchOptions: InternalFetchOptions = this.createInternalFetch(HttpMethods.DELETE, options);
    return this.fetch(url, fetchOptions, apiUsesHyphens);
  }

  private createInternalFetch(method: HttpMethods, options?: FetchOptions): InternalFetchOptions {
    return options ? { ...options, method, headers: {}, body: options.body || {} } : { method, headers: {}, body: {} };
  }
}

class FetchError extends Error {
  response?: any;
}
