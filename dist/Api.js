"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const Enums_1 = require("./Enums");
const AuthService_1 = __importDefault(require("./AuthService"));
class Api {
    constructor(apiRoot, requiresAuth, getToken, authScheme = Enums_1.AuthSchemes.Bearer) {
        this.apiRoot = apiRoot;
        this.apiRequiresAuth = requiresAuth;
        if (requiresAuth && getToken) {
            this.authService = new AuthService_1.default(authScheme, getToken);
        }
    }
    async fetch(url, options) {
        if (this.apiRequiresAuth) {
            if (!this.authService) {
                throw new Error('Api requires authentication, but AuthService was not initialized.');
            }
            this.authService.setToken();
            options.headers = Object.assign({}, options.headers, { Authorization: `${this.authService.authScheme} ${this.authService.token}` });
        }
        const root = this.apiRoot.endsWith('/') ? this.apiRoot : this.apiRoot + '/';
        const request = new Request(root + url, options);
        const response = await fetch(request);
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
        const json = await response.json();
        return json;
    }
    async get(url, options) {
        const fetchOptions = this.createRequestInit(Enums_1.HttpMethods.GET, options);
        return this.fetch(url, fetchOptions);
    }
    async post(url, options) {
        const fetchOptions = this.createRequestInit(Enums_1.HttpMethods.POST, options);
        return this.fetch(url, fetchOptions);
    }
    async put(url, options) {
        const fetchOptions = this.createRequestInit(Enums_1.HttpMethods.PUT, options);
        return this.fetch(url, fetchOptions);
    }
    async patch(url, options) {
        const fetchOptions = this.createRequestInit(Enums_1.HttpMethods.PATCH, options);
        return this.fetch(url, fetchOptions);
    }
    async delete(url, options) {
        const fetchOptions = this.createRequestInit(Enums_1.HttpMethods.DELETE, options);
        return this.fetch(url, fetchOptions);
    }
    createRequestInit(method, options) {
        const headers = options && options.headers ? options.headers : {};
        return options ? Object.assign({}, options, { method, headers, body: options.body }) : { method, headers };
    }
}
exports.default = Api;
class FetchError extends Error {
}
