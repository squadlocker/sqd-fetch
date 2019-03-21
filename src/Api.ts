import IApi from './IApi';
import AbstractApi from './AbstractApi';

export default class Api extends AbstractApi implements IApi {
  protected async resolve(response: Response, handleLoading: boolean): Promise<any> {
    if (!!this.loadingProvider && handleLoading) {
      this.loadingProvider.onResolve();
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
