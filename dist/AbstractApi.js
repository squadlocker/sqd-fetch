"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const Enums_1 = require("./Enums");
const AuthService_1 = __importDefault(require("./AuthService"));
class AbstractApi {
    constructor(apiRoot, requiresAuth, initOptions = {}) {
        this.hasAuthService = false;
        const { getToken, authScheme, loadingProvider } = initOptions;
        this.apiRoot = apiRoot;
        this.apiRequiresAuth = requiresAuth;
        if (requiresAuth) {
            if (!getToken) {
                throw new Error('Must pass token retrieval logic as a function if requiresAuth == true.');
            }
            this.authService = new AuthService_1.default(authScheme || Enums_1.AuthSchemes.Bearer, getToken);
            this.hasAuthService = true;
        }
        if (!!loadingProvider) {
            if (!loadingProvider.onBegin || !loadingProvider.onResolve) {
                throw new Error('Must provide an `onBegin` and and `onResolve` function to loadingProvider');
            }
            this.loadingProvider = loadingProvider;
        }
    }
    async fetch(url, options) {
        if (this.apiRequiresAuth) {
            if (!this.authService) {
                throw new Error('Api requires authentication, but AuthService was not initialized.');
            }
            if (!!this.loadingProvider) {
                this.loadingProvider.onBegin();
            }
            this.authService.setToken();
            options.headers = Object.assign({}, options.headers, { Authorization: `${this.authService.authScheme} ${this.authService.getToken()}` });
        }
        const root = this.apiRoot.endsWith('/') ? this.apiRoot : this.apiRoot + '/';
        const request = new Request(root + url, options);
        let response;
        try {
            response = await fetch(request);
        }
        catch (e) {
            if (!!this.loadingProvider && options.handleLoading) {
                this.loadingProvider.onResolve();
            }
            return Promise.reject(e);
        }
        return await this.resolve(response, options.handleLoading);
    }
    async get(url, options) {
        const fetchOptions = this.createRequestInit(Enums_1.HttpMethods.GET, options);
        return await this.fetch(url, fetchOptions);
    }
    async post(url, options) {
        const fetchOptions = this.createRequestInit(Enums_1.HttpMethods.POST, options);
        return await this.fetch(url, fetchOptions);
    }
    async put(url, options) {
        const fetchOptions = this.createRequestInit(Enums_1.HttpMethods.PUT, options);
        return await this.fetch(url, fetchOptions);
    }
    async patch(url, options) {
        const fetchOptions = this.createRequestInit(Enums_1.HttpMethods.PATCH, options);
        return await this.fetch(url, fetchOptions);
    }
    async delete(url, options) {
        const fetchOptions = this.createRequestInit(Enums_1.HttpMethods.DELETE, options);
        return await this.fetch(url, fetchOptions);
    }
    createRequestInit(method, options) {
        const headers = options && options.headers ? options.headers : {};
        return options ? Object.assign({}, options, { method, headers, body: options.body }) : { method, headers };
    }
}
exports.default = AbstractApi;
class FetchError extends Error {
}
