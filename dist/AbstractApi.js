"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const Enums_1 = require("./Enums");
const AuthService_1 = __importDefault(require("./AuthService"));
class AbstractApi {
    constructor(apiRoot, requiresAuth, getToken, authScheme = Enums_1.AuthSchemes.Bearer) {
        this.hasAuthService = false;
        this.apiRoot = apiRoot;
        this.apiRequiresAuth = requiresAuth;
        if (requiresAuth) {
            if (!getToken) {
                throw new Error('Must pass token retrieval logic as a function if requiresAuth == true.');
            }
            this.authService = new AuthService_1.default(authScheme, getToken);
            this.hasAuthService = true;
        }
    }
    async fetch(url, options) {
        if (this.apiRequiresAuth) {
            if (!this.authService) {
                throw new Error('Api requires authentication, but AuthService was not initialized.');
            }
            this.authService.setToken();
            options.headers = Object.assign({}, options.headers, { Authorization: `${this.authService.authScheme} ${this.authService.getToken()}` });
        }
        const root = this.apiRoot.endsWith('/') ? this.apiRoot : this.apiRoot + '/';
        const request = new Request(root + url, options);
        const response = await fetch(request);
        return await this.resolve(response);
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
