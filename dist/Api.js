"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const camelizeObject_1 = require("./util/camelizeObject");
const Enums_1 = require("./Enums");
const AuthService_1 = __importDefault(require("./AuthService"));
class Api {
    // TODO: implement auth / token management
    constructor(apiRoot, requiresAuth, getToken, authScheme = Enums_1.AuthSchemes.Bearer) {
        this.apiRoot = apiRoot;
        this.apiRequiresAuth = requiresAuth;
        this.authService = new AuthService_1.default(authScheme, getToken);
    }
    async fetch(url, options, apiUsesHyphens) {
        if (this.apiRequiresAuth) {
            this.authService.setToken();
            options.headers.Authentication = `${this.authService.authScheme} ${this.authService.token}`;
        }
        // when working with certain frameworks, e.g. Rails, apis will expect and return objects where properties
        // are in hypen-case. 
        if (apiUsesHyphens) {
            options.body = camelizeObject_1.hyphenizeObject(options.body);
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
        if (!apiUsesHyphens)
            return json;
        return camelizeObject_1.camelizeObject(json);
    }
    async get(url, options, apiUsesHyphens) {
        const fetchOptions = this.createInternalFetch(Enums_1.HttpMethods.GET, options);
        return this.fetch(url, fetchOptions, apiUsesHyphens);
    }
    async post(url, options, apiUsesHyphens) {
        const fetchOptions = this.createInternalFetch(Enums_1.HttpMethods.POST, options);
        return this.fetch(url, fetchOptions, apiUsesHyphens);
    }
    async put(url, options, apiUsesHyphens) {
        const fetchOptions = this.createInternalFetch(Enums_1.HttpMethods.PUT, options);
        return this.fetch(url, fetchOptions, apiUsesHyphens);
    }
    async patch(url, options, apiUsesHyphens) {
        const fetchOptions = this.createInternalFetch(Enums_1.HttpMethods.PATCH, options);
        return this.fetch(url, fetchOptions, apiUsesHyphens);
    }
    async delete(url, options, apiUsesHyphens) {
        const fetchOptions = this.createInternalFetch(Enums_1.HttpMethods.DELETE, options);
        return this.fetch(url, fetchOptions, apiUsesHyphens);
    }
    createInternalFetch(method, options) {
        return options ? Object.assign({}, options, { method, headers: {}, body: options.body || {} }) : { method, headers: {}, body: {} };
    }
}
exports.default = Api;
class FetchError extends Error {
}
