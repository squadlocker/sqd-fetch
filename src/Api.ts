import IApi from './IApi';
import AbstractApi from './AbstractApi';
import IRequestOptions from './IRequestOptions';

export default class Api extends AbstractApi implements IApi {
  protected async resolve(response: Response, options: IRequestOptions): Promise<any> {
    for (let i = this.sqdProviders.length - 1; i >= 0; i--) {
      const provider = this.sqdProviders[i];
      provider.onResolve(options, response);
    }

    if (response.status === 204) {
      return { status: 204, success: true };
    }

    if (!response.ok) {
      const error = new FetchError("Failed request");
      error.response = response;
      throw error;
    }

    return await response.json();
  }
}

class FetchError extends Error {
  response?: any;
}
