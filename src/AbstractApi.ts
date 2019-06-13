import { AuthSchemes, HttpMethods } from './Enums';
import AuthService from './AuthService';
import ISqdProvider from './ISqdProvider';
import IInitOptions from './IInitOptions';
import IRequestOptions from './IRequestOptions';

export default abstract class AbstractApi {
  readonly apiRoot: string;
  readonly apiRequiresAuth: boolean;
  hasAuthService: boolean = false;
  private readonly authService?: AuthService;
  protected readonly sqdProvider: ISqdProvider[];

  constructor(apiRoot: string, requiresAuth: boolean, initOptions: IInitOptions = {}) {
    const {
      getToken,
      authScheme
    } = initOptions;

    this.sqdProvider = [];
    this.apiRoot = apiRoot;
    this.apiRequiresAuth = requiresAuth;
    if (requiresAuth) {
      if (!getToken) {
        throw new Error('Must pass token retrieval logic as a function if requiresAuth == true.');
      }
      this.authService = new AuthService(authScheme || AuthSchemes.Bearer, getToken);
      this.hasAuthService = true;
    }
  }

  protected abstract async resolve(response: Response, options: IRequestOptions): Promise<any>;

  async fetch(url: string, options: IRequestOptions): Promise<any> {
    if (this.apiRequiresAuth) {
      if (!this.authService) {
        throw new Error('Api requires authentication, but AuthService was not initialized.');
      }

      for (const provider of this.sqdProvider) {
        provider.onBegin(options);
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
    } catch (e) {
      for (let i = this.sqdProvider.length - 1; i >= 0; i--) {
        const provider = this.sqdProvider[i];
        provider.onFail(options, response, e);
      }

      throw e;
    }

    // if Promise.reject gets called for HTTP status code,
    // the caller is expected to catch and handle it.
    return await this.resolve(response, options);
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

  public addSqdProvider(provider:ISqdProvider): AbstractApi {
    if (provider.onBegin && provider.onResolve && provider.onFail) {
      this.sqdProvider.push(provider);
    }
    return this;
  }

  public hasSqdProvider(provider:ISqdProvider): boolean {
    return this.sqdProvider.includes(provider);
  }

  public indexOfSqdProvider(provider:ISqdProvider): number {
    return this.sqdProvider.indexOf(provider);
  }

  public deleteSqdProvider(provider:ISqdProvider): boolean {
    const index = this.indexOfSqdProvider(provider);
    return this.deleteSqdProviderByIndex(index);
  }

  public deleteSqdProviderByIndex(index:number): boolean {
    const length = this.sqdProvider.length;
    this.sqdProvider.splice(index, 1);
    return this.sqdProvider.length < length;
  }
}
