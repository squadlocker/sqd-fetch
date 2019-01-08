import { HttpMethods, AuthSchemes } from './Enums';
import AuthService from './AuthService';
import ILoadingProvider from './ILoadingProvider';

export default abstract class AbstractApi {
  readonly apiRoot: string;
  readonly apiRequiresAuth: boolean;
  hasAuthService: boolean = false;
  private readonly authService?: AuthService;
  protected readonly loadingProvider?: ILoadingProvider;

  constructor(apiRoot: string, requiresAuth: boolean, getToken?: (...args: any[]) => string, loadingProvider?: ILoadingProvider, authScheme: AuthSchemes = AuthSchemes.Bearer) {
    this.apiRoot = apiRoot;
    this.apiRequiresAuth = requiresAuth;
    if (requiresAuth) {
      if (!getToken) {
        throw new Error('Must pass token retrieval logic as a function if requiresAuth == true.');
      }
      this.authService = new AuthService(authScheme, getToken);
      this.hasAuthService = true;
    }

    if (!!loadingProvider) {
      if (!loadingProvider.onBegin || !loadingProvider.onResolve) {
        throw new Error('Must provide an `onBegin` and and `onResolve` function to loadingProvider');
      }
      this.loadingProvider = loadingProvider;
    }
  }

  protected abstract async resolve(response: Response): Promise<any>;

  async fetch(url: string, options: RequestInit): Promise<any> {
    if (this.apiRequiresAuth) {
      if (!this.authService) {
        throw new Error('Api requires authentication, but AuthService was not initialized.');
      }

      if (!!this.loadingProvider) {
        this.loadingProvider.onBegin();
      }

      this.authService.setToken();
      options.headers = {
        ...options.headers,
        Authorization: `${this.authService.authScheme} ${this.authService.getToken()}`
      };
    }

    const root = this.apiRoot.endsWith('/') ? this.apiRoot : this.apiRoot + '/';
    const request = new Request(root + url, options);
    let response;
    try {
      response = await fetch(request);
    } catch(e) {
      if (!!this.loadingProvider) {
        this.loadingProvider.onResolve();
      }
      return Promise.reject(e);
    }

    return await this.resolve(response);
  }

  async get(url: string, options?: RequestInit): Promise<any> {
    const fetchOptions: RequestInit = this.createRequestInit(HttpMethods.GET, options);
    return await this.fetch(url, fetchOptions);
  }

  async post(url: string, options?: RequestInit): Promise<any> {
    const fetchOptions: RequestInit = this.createRequestInit(HttpMethods.POST, options);
    return await this.fetch(url, fetchOptions);
  }

  async put(url: string, options?: RequestInit): Promise<any> {
    const fetchOptions: RequestInit = this.createRequestInit(HttpMethods.PUT, options);
    return await this.fetch(url, fetchOptions);
  }

  async patch(url: string, options?: RequestInit): Promise<any> {
    const fetchOptions: RequestInit = this.createRequestInit(HttpMethods.PATCH, options);
    return await this.fetch(url, fetchOptions);
  }

  async delete(url: string, options?: RequestInit): Promise<any> {
    const fetchOptions: RequestInit = this.createRequestInit(HttpMethods.DELETE, options);
    return await this.fetch(url, fetchOptions);
  }

  protected createRequestInit(method: HttpMethods, options?: RequestInit): RequestInit {
    const headers = options && options.headers ? options.headers : {};
    return options ? { ...options, method, headers, body: options.body } : { method, headers };
  }
}

class FetchError extends Error {
  response?: any;
}
