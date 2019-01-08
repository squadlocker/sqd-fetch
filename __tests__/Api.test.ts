import Api from '../src/Api';
import { HttpMethods } from '../src/Enums';
import ILoadingProvider from '../src/ILoadingProvider';

const rootUrl = 'https://test.com';

const loadingTestState = {
  isLoading: false,
  counter: 0
};

const beginLoading: () => void = () => {
  loadingTestState.isLoading = true;
  loadingTestState.counter++;
};
const endLoading: () => void = () => {
  loadingTestState.isLoading = false;
};

describe('Initialize API', () => {
  const api = new Api(rootUrl, false);

  test('apiRoot is the correct value', () => {
    expect(api.apiRoot).toBe(rootUrl);
  });

  describe('when requiresAuth is false', () => {
    test('no AuthService has been bound to Api instance', () => {
      expect(api.hasAuthService).toBe(false);
    });
  });

  describe('when requiresAuth is true', () => {
    describe('and no getToken function is passed', () => {
      test('Api throws an error.', () => {
        expect(() => new Api(rootUrl, true)).toThrow(Error);
      });
    });

    describe('and a getToken function is passed', () => {
      const api1 = new Api(rootUrl, true, {getToken: () => 'token'});
      test('authService has been bound to Api instance', () => {
        expect(api1.hasAuthService).toBe(true);
      });
    })

  });
});

describe('public API methods', () => {
  beforeEach(() => {
    fetch.resetMocks();
    fetch.mockResponse(JSON.stringify({ success: true, result: "test result" }));
  });

  const loadingProvider: ILoadingProvider = {
    onBegin: beginLoading,
    onResolve: endLoading
  };

  const api = new Api(rootUrl, true, {
    getToken: () => 'token', loadingProvider
  });

  test('each public method triggers a fetch', async () => {
    await api.get('test');
    await api.post('test');
    await api.put('test');
    await api.patch('test');
    await api.delete('test');

    expect(fetch.mock.calls.length).toBe(5);
  });

  describe('each public method dispatches the correct HttpMethod', () => {
    test('api.get uses HttpMethods.GET', async () => {
      const res = await api.get('test');
      expect(fetch.mock.calls[0][0].method).toBe(HttpMethods.GET);
    });

    test('api.post uses HttpMethods.POST', async () => {
      const res = await api.post('test');
      expect(fetch.mock.calls[0][0].method).toBe(HttpMethods.POST);
    });

    test('api.put uses HttpMethods.PUT', async () => {
      const res = await api.put('test');
      expect(fetch.mock.calls[0][0].method).toBe(HttpMethods.PUT);
    });

    test('api.patch uses HttpMethods.PATCH', async () => {
      const res = await api.patch('test');
      expect(fetch.mock.calls[0][0].method).toBe(HttpMethods.PATCH);
    });

    test('api.delete uses HttpMethods.DELETE', async () => {
      const res = await api.delete('test');
      expect(fetch.mock.calls[0][0].method).toBe(HttpMethods.DELETE);
    });
  });

  test('authorization header is sent to fetch', async () => {
    const res = await api.get('test');

    expect(fetch.mock.calls[0][0].headers._headers).toEqual({ authorization: ['Bearer token']});
  });

  test('json body with content-type header is sent to fetch', async () => {
    const body = JSON.stringify({
      'one': 'Peter Peter Pumpkin Eater',
      'two': 'fish'
    });

    const res = await api.post('test/create', {
      headers: {
        'Content-Type': 'application/json'
      },
      body
    });
    expect(fetch.mock.calls[0][0].headers._headers['content-type']).toEqual(['application/json']);
    expect(JSON.parse(fetch.mock.calls[0][0].body)).toEqual(JSON.parse(body));
  });

  test('form-data body is sent to fetch', async () => {
    const formData = new FormData();
    formData.append('key', 'value');
    formData.append('key2', 'value2');

    const res = await api.post('test/upload', { body: formData });
    expect(fetch.mock.calls[0][0].body).toEqual(formData);
  });

  describe('Loading provider', () => {
    let counter: number;
    test('ILoadingProvider.onBegin is called if handleLoading is true', async () => {
      await api.get('test', { handleLoading: true });
      counter = loadingTestState.counter;
      expect(loadingTestState.counter > 0);
    });

    test('ILoadingProvider.onBegin is called if no handleLoading option is passed', async () => {
      const expectedValue = counter + 1;

      await api.get('test');
      counter = loadingTestState.counter;
      expect(counter === expectedValue);
    });

    test('ILoadingProvider.onBegin is not called if handleLoading is false', async () => {
      await api.get('test', { handleLoading: false });
      expect(loadingTestState.counter === counter);
    });

    test('loading state is false after resolution', async () => {
      await api.get('test', { handleLoading: true });
      expect(loadingTestState.isLoading === false);
    })
  });

});
