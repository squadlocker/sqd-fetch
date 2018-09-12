import IApi, { FetchMethod } from './IApi';
import { FetchOptions } from './FetchOptions';
import { HttpMethods, AuthSchemes } from './Enums';
import AuthService from './AuthService';

export default class Api implements IApi {
  readonly apiRoot: string;
  readonly apiRequiresAuth: boolean;
  hasAuthService: boolean = false;
  private authService?: AuthService;

  constructor(apiRoot: string, requiresAuth: boolean, getToken?: () => string, authScheme: AuthSchemes = AuthSchemes.Bearer) {
    this.apiRoot = apiRoot;
    this.apiRequiresAuth = requiresAuth;
    if (requiresAuth) {
      if (!getToken) {
        throw new Error('Must pass token retrieval logic as a function if requiresAuth == true.');
      }
      this.authService = new AuthService(authScheme, getToken);
      this.hasAuthService = true;
    }
  }

  private async fetch(url: string, options: RequestInit): Promise<any> {
    if (this.apiRequiresAuth) {
      if (!this.authService) {
        throw new Error('Api requires authentication, but AuthService was not initialized.');
      }

      this.authService.setToken();
      options.headers = {
        ...options.headers,
        Authorization: `${this.authService.authScheme} ${this.authService.getToken()}`
      };
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

    return await response.json();
  }

  async get(url: string, options?: FetchOptions): Promise<any> {
    const fetchOptions: RequestInit = this.createRequestInit(HttpMethods.GET, options);
    return await this.fetch(url, fetchOptions);
  }

  async post(url: string, options?: FetchOptions): Promise<any> {
    const fetchOptions: RequestInit = this.createRequestInit(HttpMethods.POST, options);
    return await this.fetch(url, fetchOptions);
  }

  async put(url: string, options?: FetchOptions): Promise<any> {
    const fetchOptions: RequestInit = this.createRequestInit(HttpMethods.PUT, options);
    return await this.fetch(url, fetchOptions);
  }

  async patch(url: string, options?: FetchOptions): Promise<any> {
    const fetchOptions: RequestInit = this.createRequestInit(HttpMethods.PATCH, options);
    return await this.fetch(url, fetchOptions);
  }

  async delete(url: string, options?: FetchOptions): Promise<any> {
    const fetchOptions: RequestInit = this.createRequestInit(HttpMethods.DELETE, options);
    return await this.fetch(url, fetchOptions);
  }

  private createRequestInit(method: HttpMethods, options?: FetchOptions): RequestInit {
    const headers = options && options.headers ? options.headers : {};
    return options ? { ...options, method, headers, body: options.body } : { method, headers };
  }
}

class FetchError extends Error {
  response?: any;
}
