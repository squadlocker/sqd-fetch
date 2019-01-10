import {AuthSchemes, HttpMethods} from './Enums';
import AuthService from './AuthService';
import ILoadingProvider from './ILoadingProvider';
import IInitOptions from './IInitOptions';

export default abstract class AbstractApi {
  readonly apiRoot: string;
  readonly apiRequiresAuth: boolean;
  hasAuthService: boolean = false;
  private readonly authService?: AuthService;
  protected readonly loadingProvider?: ILoadingProvider;

  constructor(apiRoot: string, requiresAuth: boolean, initOptions: IInitOptions = {}) {
    const {
      getToken,
      authScheme,
      loadingProvider
    } = initOptions;

    this.apiRoot = apiRoot;
    this.apiRequiresAuth = requiresAuth;
    if (requiresAuth) {
      if (!getToken) {
        throw new Error('Must pass token retrieval logic as a function if requiresAuth == true.');
      }
      this.authService = new AuthService(authScheme || AuthSchemes.Bearer, getToken);
      this.hasAuthService = true;
    }

    if (!!loadingProvider) {
      if (!loadingProvider.onBegin || !loadingProvider.onResolve) {
        throw new Error('Must provide an `onBegin` and and `onResolve` function to loadingProvider');
      }
      this.loadingProvider = loadingProvider;
    }
  }

  protected abstract async resolve(response: Response, handleLoading: boolean): Promise<any>;

  async fetch(url: string, options: IRequestOptions): Promise<any> {
    // we should handle loading by default if there's a loading provider and no `handleLoading`
    // key in our options object. Otherwise, if there is a loading provider, we go by the value of the
    // handleLoading option. If no loadingProvider, we will never handle loading.
    let handleLoading = false;
    if (!!this.loadingProvider) {
      handleLoading = !(options.hasOwnProperty('handleLoading') && options.handleLoading === false);
    }

    if (this.apiRequiresAuth) {
      if (!this.authService) {
        throw new Error('Api requires authentication, but AuthService was not initialized.');
      }

      if (handleLoading && !!this.loadingProvider) {
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
    const response = await fetch(request);

    return await this.resolve(response, handleLoading);
  }

  async get(url: string, options?: IRequestOptions): Promise<any> {
    const fetchOptions: RequestInit = this.createRequestInit(HttpMethods.GET, options);
    return await this.fetch(url, fetchOptions);
  }

  async post(url: string, options?: IRequestOptions): Promise<any> {
    const fetchOptions: RequestInit = this.createRequestInit(HttpMethods.POST, options);
    return await this.fetch(url, fetchOptions);
  }

  async put(url: string, options?: IRequestOptions): Promise<any> {
    const fetchOptions: RequestInit = this.createRequestInit(HttpMethods.PUT, options);
    return await this.fetch(url, fetchOptions);
  }

  async patch(url: string, options?: IRequestOptions): Promise<any> {
    const fetchOptions: RequestInit = this.createRequestInit(HttpMethods.PATCH, options);
    return await this.fetch(url, fetchOptions);
  }

  async delete(url: string, options?: IRequestOptions): Promise<any> {
    const fetchOptions: RequestInit = this.createRequestInit(HttpMethods.DELETE, options);
    return await this.fetch(url, fetchOptions);
  }

  protected createRequestInit(method: HttpMethods, options?: RequestInit): RequestInit {
    const headers = options && options.headers ? options.headers : {};
    return options ? { ...options, method, headers, body: options.body } : { method, headers };
  }
}

interface IRequestOptions extends RequestInit {
  handleLoading?: boolean;
}

class FetchError extends Error {
  response?: any;
}
