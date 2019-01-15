import IApi from './IApi';
import AbstractApi from './AbstractApi';

export default class Api extends AbstractApi implements IApi {
  protected async resolve(response: Response, handleLoading: boolean): Promise<any> {
    if (!!this.loadingProvider && handleLoading) {
      this.loadingProvider.onResolve();
    }
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
}

class FetchError extends Error {
  response?: any;
}
