import Api from '../src/Api';
import { HttpMethods } from '../src/Enums';

const rootUrl = 'https://test.com';

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
      const api1 = new Api(rootUrl, true, () => 'token');
      test('authService has been bound to Api instance', () => {
        expect(api1.hasAuthService).toBe(true);
      });
    })
    
  });
});

describe('API methods', () => {
  beforeEach(() => {
    fetch.resetMocks();
    fetch.mockResponse(JSON.stringify({ success: true, result: "test result" }));
  })
  
  const api = new Api(rootUrl, true, () => 'token');

  describe('each method dispatches the correct HttpMethod', () => {
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
  })
});
