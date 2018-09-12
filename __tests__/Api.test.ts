import Api from '../src/Api';

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
