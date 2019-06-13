"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const AbstractApi_1 = __importDefault(require("./AbstractApi"));
class Api extends AbstractApi_1.default {
    async resolve(response, options) {
        for (let i = this.sqdProviders.length - 1; i >= 0; i--) {
            const provider = this.sqdProviders[i];
            provider.onResolve(options, response);
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
exports.default = Api;
class FetchError extends Error {
}
