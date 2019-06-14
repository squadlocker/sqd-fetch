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
        const { getToken, authScheme } = initOptions;
        this.sqdProviders = [];
        this.apiRoot = apiRoot;
        this.apiRequiresAuth = requiresAuth;
        if (requiresAuth) {
            if (!getToken) {
                throw new Error('Must pass token retrieval logic as a function if requiresAuth == true.');
            }
            this.authService = new AuthService_1.default(authScheme || Enums_1.AuthSchemes.Bearer, getToken);
            this.hasAuthService = true;
        }
    }
    async fetch(url, options) {
        if (this.apiRequiresAuth) {
            if (!this.authService) {
                throw new Error('Api requires authentication, but AuthService was not initialized.');
            }
            for (const provider of this.sqdProviders) {
                provider.onBegin(options);
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
            for (let i = this.sqdProviders.length - 1; i >= 0; i--) {
                const provider = this.sqdProviders[i];
                provider.onFail(options, response, e);
            }
            throw e;
        }
        // if Promise.reject gets called for HTTP status code,
        // the caller is expected to catch and handle it.
        return await this.resolve(response, options);
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
    addSqdProvider(provider) {
        if (provider.onBegin && provider.onResolve && provider.onFail) {
            this.sqdProviders.push(provider);
        }
        return this;
    }
    hasSqdProvider(provider) {
        return this.sqdProviders.includes(provider);
    }
    indexOfSqdProvider(provider) {
        return this.sqdProviders.indexOf(provider);
    }
    deleteSqdProvider(provider) {
        const index = this.indexOfSqdProvider(provider);
        if (index < 0)
            return false;
        return this.deleteSqdProviderByIndex(index);
    }
    deleteSqdProviderByIndex(index) {
        const length = this.sqdProviders.length;
        if (index < 0 || index >= length)
            return false;
        this.sqdProviders.splice(index, 1);
        return this.sqdProviders.length < length;
    }
}
exports.default = AbstractApi;
